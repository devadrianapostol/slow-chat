import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../domain/entities/conversation.dart';
import '../../../domain/entities/message.dart';
import '../../../domain/repositories/chat_repository.dart';
import '../../../domain/usecases/send_message.dart';
import 'dart:io';

// Events
abstract class ChatEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class SendMessageEvent extends ChatEvent {
  final String conversationId;
  final String senderId;
  final String senderName;
  final String text;
  final List<File>? attachments;

  SendMessageEvent({
    required this.conversationId,
    required this.senderId,
    required this.senderName,
    required this.text,
    this.attachments,
  });

  @override
  List<Object?> get props => [conversationId, senderId, senderName, text, attachments];
}

// States
abstract class ChatState extends Equatable {
  @override
  List<Object?> get props => [];
}

class ChatInitial extends ChatState {}

class ChatLoading extends ChatState {}

class MessageSent extends ChatState {}

class ChatError extends ChatState {
  final String message;

  ChatError(this.message);

  @override
  List<Object> get props => [message];
}

// BLoC
class ChatBloc extends Bloc<ChatEvent, ChatState> {
  final SendMessage sendMessage;

  ChatBloc({required this.sendMessage}) : super(ChatInitial()) {
    on<SendMessageEvent>(_onSendMessage);
  }

  Future<void> _onSendMessage(SendMessageEvent event, Emitter<ChatState> emit) async {
    emit(ChatLoading());
    
    final result = await sendMessage(SendMessageParams(
      conversationId: event.conversationId,
      senderId: event.senderId,
      senderName: event.senderName,
      text: event.text,
      attachments: event.attachments,
    ));

    result.fold(
      (failure) => emit(ChatError(failure.message)),
      (_) => emit(MessageSent()),
    );
  }
}
