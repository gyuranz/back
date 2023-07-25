// src/app.gateway.ts

import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket
  } from '@nestjs/websockets';
  import { Socket } from 'socket.io'; // Server
  import { SttService } from './stt.service';

  // , methods: ['GET', 'POST'] 

  //! 임시 룸 생성
  @WebSocketGateway({
    namespace: 'room',
    cors: {
      // origin: [ 'http://15.164.100.230:3000'],
      origin: [ 'http://localhost:3000'],
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
    
    @SubscribeMessage('startGoogleCloudStream')
    async handleStartGoogleCloudStream(client: Socket, @MessageBody() data: any) {
      // this.startRecognitionStream(client, data);
      this.startRecognitionStream(this.server);
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
  
    // private async startRecognitionStream(client: Socket, data: any) {
      private async startRecognitionStream(client: Socket) {
      console.log('* StartRecognitionStream\n');
      const encoding = 'LINEAR16';
      const sampleRateHertz = 16000;
      const languageCode = 'ko-KR';
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
        },
        interimResults: true,
      };
      try {
        // this.recognizeStream = await this.sttService.getRecognitionStream();
        this.recognizeStream = this.sttService.speechClient
        .streamingRecognize(request as any)
        .on('error', console.error)

        // console.log(this.recognizeStream);   done
        // this.recognizeStream.on('error', console.error);
        // this.recognizeStream.on('data', (data: any) => {
        .on("data", (data:any) =>{  
          const result = data.results[0];
          const isFinal = result.isFinal;
          const transcription = data.results
            .map((result: any) => result.alternatives[0].transcript)
            .join('\n');
  
          console.log(`Transcription: `, transcription);
  
          client.emit('receive_audio_text', {
            text: transcription,
            isFinal: isFinal,
          });
  
          // if end of utterance, let's restart stream
          // this is a small hack to keep restarting the stream on the server and keep the connection with Google API
          // Google API disconnects the stream every five minutes
          if (data.results[0] && data.results[0].isFinal) {
            this.stopRecognitionStream();
            this.startRecognitionStream(this.server);
            console.log('restarted stream serverside');
          }
        });
      } catch (err) {
        console.error('Error streaming google api ' + err);
      }
    }
  
    private stopRecognitionStream() {
      if (this.recognizeStream) {
        console.log('* StopRecognitionStream \n');
        this.recognizeStream.end();
      }
      this.recognizeStream = null;
    }
  }
  