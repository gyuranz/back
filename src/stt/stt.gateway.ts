import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io'; // Server
import { SttService } from './stt.service';
// , methods: ['GET', 'POST']
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SttGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Socket;

  constructor(private readonly sttService: SttService) {}

  // afterInit() {}

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  // client 쪽에서 emit하는 이벤트 메시지
  // send_message, startGoogleCloudStream, endGoogleCloudStream, send_audio_data
  @SubscribeMessage('send_message')
  handleMessage(@MessageBody() message: string) {
    console.log('message: ' + message);
    setTimeout(() => {
      this.server.emit('receive_message', 'got this message' + message);
    }, 1000);
  }

  // @SubscribeMessage('startGoogleCloudStream')
  // async handleStartGoogleCloudStream(client: Socket, @MessageBody() data: any) {
  //   // this.startRecognitionStream(client, data);
  //   this.startRecognitionStream(this.server);
  // }
  //! 임시변경됨
  @SubscribeMessage('startGoogleCloudStream')
  async handleStartGoogleCloudStream(
    client: Socket,
    @MessageBody()
    {
      message,
      room_id,
      user_nickname,
    }: { message: string; room_id: string; user_nickname: string },
  ) {
    // this.startRecognitionStream(client, data);
    this.startRecognitionStream(this.server, room_id, user_nickname);
  }

  @SubscribeMessage('endGoogleCloudStream')
  handleEndGoogleCloudStream() {
    console.log('** ending google cloud stream **\n');
    this.stopRecognitionStream();
  }

  @SubscribeMessage('send_audio_data')
  async handleSendAudioData(
    @MessageBody() audioData: { audio: Buffer },
  ): Promise<void> {
    this.server.emit('receive_message', 'Got audio data');
    if (this.recognizeStream !== null) {
      try {
        this.recognizeStream.write(audioData.audio);
      } catch (err) {
        console.log('Error calling google api ' + err);
      }
    } else {
      console.log('RecognizeStream is null');
    }
  }

  private recognizeStream = null;

  private async startRecognitionStream(
    client: Socket,
    room_id: string,
    user_nickname: string,
  ) {
    console.log('* StartRecognitionStream\n');
    const encoding = 'LINEAR16';
    const sampleRateHertz = 16000;
    const languageCode = 'ko-KR';
    //인코딩 정보
    const request = {
      config: {
        encoding,
        sampleRateHertz,
        languageCode,
        enableWordTimeOffsets: true,
        enableAutomaticPunctuation: true,
        enableWordConfidence: true,
        enableSpeakerDiarization: true,
        model: 'command_and_search',
        useEnhanced: true,
        speechContexts: [{
          phrases: ['짜파구리','짜파게티','너구리','쌀국수','싸르보나라','둥지라볶이','비빔둥지냉면','라볶이','맵찔이','대인이형','불닭게티','불닭볶음면','오뚜기','뽀글이','국룰'],
          boost:20,
        }],
      },
      interimResults: true,
    };
    try {
      // this.recognizeStream = await this.appService.getRecognitionStream();
      this.recognizeStream = this.sttService.speechClient
        .streamingRecognize(request as any)
        .on('error', console.error)

        // console.log(this.recognizeStream);   done
        // this.recognizeStream.on('error', console.errorㅛ);
        // this.recognizeStream.on('data', (data: any) => {
        .on('data', (data: any) => {
          const result = data.results[0];
          const isFinal = result.isFinal; //말이 끊겼을때 stt 작업 멈추고 transcription 을 리턴해줌
          const transcription = data.results // stt 결과물
            .map((result: any) => result.alternatives[0].transcript)
            .join('\n');

          // 방에 있는 유저들에게 transcription 결과물 보내줌
          client.to(room_id).emit('receive_audio_text', {
            text: transcription,
            isFinal: isFinal,
            room_id,
            user_nickname,
          });
          if (isFinal) {
            // DB에 저장하는 코드
            // this.sttService.createMessage({stt_message:transcription} as any);
            console.log(`Transcription: `, transcription);
            this.sttService.createMessagetoChat({
              message: transcription,
              room_id,
              user_nickname,
            } as any);
          }

          if (data.results[0] && data.results[0].isFinal) {
            //오랫동안 음성감지가 되지 않았을 때 자동으로 stt종료
            this.stopRecognitionStream();

            //말이 끊긴 이후 다시 음성을 감지해서 stt 작업을 반복.
            this.startRecognitionStream(this.server, room_id, user_nickname);
            console.log('restarted stream serverside');
          }
        });
    } catch (err) {
      console.error('Error streaming google api ' + err);
    }
  }

  //종료신호를 받았을 때 stt 종료
  private stopRecognitionStream() {
    if (this.recognizeStream) {
      console.log('* StopRecognitionStream \n');
      this.recognizeStream.end();
    }
    this.recognizeStream = null;
  }
}
