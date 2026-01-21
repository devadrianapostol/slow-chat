class ServerException implements Exception {
  final String message;
  
  ServerException([this.message = 'Server error occurred']);
  
  @override
  String toString() => message;
}

class CacheException implements Exception {
  final String message;
  
  CacheException([this.message = 'Cache error occurred']);
  
  @override
  String toString() => message;
}

class NetworkException implements Exception {
  final String message;
  
  NetworkException([this.message = 'Network error occurred']);
  
  @override
  String toString() => message;
}

class AuthenticationException implements Exception {
  final String message;
  
  AuthenticationException([this.message = 'Authentication failed']);
  
  @override
  String toString() => message;
}

class RateLimitException implements Exception {
  final String message;
  final DateTime nextAvailable;
  
  RateLimitException(this.message, this.nextAvailable);
  
  @override
  String toString() => message;
}
