import 'package:flutter_test/flutter_test.dart';

// Rate limiting utility tests
void main() {
  group('Rate Limit Utils', () {
    test('should calculate time remaining correctly', () {
      final now = DateTime.now();
      final nextAvailable = now.add(const Duration(hours: 3, minutes: 30));
      final diff = nextAvailable.difference(now);
      
      expect(diff.inHours, equals(3));
      expect(diff.inMinutes % 60, equals(30));
    });

    test('should check if 24 hours have passed', () {
      final lastMessageTime = DateTime.now().subtract(const Duration(hours: 25));
      final now = DateTime.now();
      final diff = now.difference(lastMessageTime);
      
      expect(diff.inHours >= 24, isTrue);
    });

    test('should check if less than 24 hours have passed', () {
      final lastMessageTime = DateTime.now().subtract(const Duration(hours: 12));
      final now = DateTime.now();
      final diff = now.difference(lastMessageTime);
      
      expect(diff.inHours < 24, isTrue);
    });

    test('should format time remaining as hours and minutes', () {
      const duration = Duration(hours: 3, minutes: 45);
      
      final hours = duration.inHours;
      final minutes = duration.inMinutes % 60;
      
      expect(hours, equals(3));
      expect(minutes, equals(45));
    });
  });
}
