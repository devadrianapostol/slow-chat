import 'package:dartz/dartz.dart';
import '../entities/conversation.dart';
import '../entities/message.dart';
import '../../core/errors/failures.dart';
import 'dart:io';

abstract class ChatRepository {
  // Conversations
  Stream<Either<Failure, List<Conversation>>> getConversations(String userId);
  Future<Either<Failure, Conversation>> createConversation(String currentUserId, String otherUserEmail);
  
  // Messages
  Stream<Either<Failure, List<Message>>> getMessages(String conversationId);
  Future<Either<Failure, void>> sendMessage({
    required String conversationId,
    required String senderId,
    required String senderName,
    required String text,
    List<File>? attachments,
    DateTime? scheduledFor,
  });
  
  // Rate Limiting
  Future<Either<Failure, RateLimitInfo>> checkRateLimit(String conversationId, String userId);
}

class RateLimitInfo {
  final bool canSend;
  final DateTime? nextAvailable;
  final Duration? timeRemaining;

  const RateLimitInfo({
    required this.canSend,
    this.nextAvailable,
    this.timeRemaining,
  });
}
