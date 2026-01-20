import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String uid;
  final String email;
  final String displayName;
  final DateTime? lastSeen;

  const User({
    required this.uid,
    required this.email,
    required this.displayName,
    this.lastSeen,
  });

  @override
  List<Object?> get props => [uid, email, displayName, lastSeen];
}
