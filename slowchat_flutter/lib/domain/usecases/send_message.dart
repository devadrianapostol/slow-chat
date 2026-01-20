import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'dart:io';
import '../../core/errors/failures.dart';
import '../../core/usecases/usecase.dart';
import '../repositories/chat_repository.dart';

class SendMessage implements UseCase<void, SendMessageParams> {
  final ChatRepository repository;

  SendMessage(this.repository);

  @override
  Future<Either<Failure, void>> call(SendMessageParams params) async {
    return await repository.sendMessage(
      conversationId: params.conversationId,
      senderId: params.senderId,
      senderName: params.senderName,
      text: params.text,
      attachments: params.attachments,
      scheduledFor: params.scheduledFor,
    );
  }
}

class SendMessageParams extends Equatable {
  final String conversationId;
  final String senderId;
  final String senderName;
  final String text;
  final List<File>? attachments;
  final DateTime? scheduledFor;

  const SendMessageParams({
    required this.conversationId,
    required this.senderId,
    required this.senderName,
    required this.text,
    this.attachments,
    this.scheduledFor,
  });

  @override
  List<Object?> get props => [
        conversationId,
        senderId,
        senderName,
        text,
        attachments,
        scheduledFor,
      ];
}
