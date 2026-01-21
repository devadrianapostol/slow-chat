import 'package:equatable/equatable.dart';
import 'user.dart';

class Conversation extends Equatable {
  final String id;
  final List<String> participants;
  final List<User> participantDetails;
  final String lastMessage;
  final DateTime lastMessageAt;
  final DateTime createdAt;

  const Conversation({
    required this.id,
    required this.participants,
    required this.participantDetails,
    required this.lastMessage,
    required this.lastMessageAt,
    required this.createdAt,
  });

  User getOtherParticipant(String currentUserId) {
    return participantDetails.firstWhere(
      (user) => user.uid != currentUserId,
    );
  }

  @override
  List<Object> get props => [
        id,
        participants,
        participantDetails,
        lastMessage,
        lastMessageAt,
        createdAt,
      ];
}
