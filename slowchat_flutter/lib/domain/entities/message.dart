import 'package:equatable/equatable.dart';

class Message extends Equatable {
  final String id;
  final String conversationId;
  final String senderId;
  final String senderName;
  final String text;
  final List<Attachment> attachments;
  final DateTime createdAt;
  final bool scheduled;

  const Message({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.senderName,
    required this.text,
    required this.attachments,
    required this.createdAt,
    this.scheduled = false,
  });

  @override
  List<Object> get props => [
        id,
        conversationId,
        senderId,
        senderName,
        text,
        attachments,
        createdAt,
        scheduled,
      ];
}

class Attachment extends Equatable {
  final String url;
  final String name;
  final String type;
  final int size;

  const Attachment({
    required this.url,
    required this.name,
    required this.type,
    required this.size,
  });

  bool get isImage => type.startsWith('image/');
  bool get isVideo => type.startsWith('video/');

  @override
  List<Object> get props => [url, name, type, size];
}
