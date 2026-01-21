# SlowChat Flutter

Mobile application for SlowChat - a slow messaging app with strict rate limiting (1 message per 24 hours).

## Features

- 🔐 Firebase Authentication
- 💬 One-on-one messaging
- ⏰ 1 message / 24 hours rate limiting
- 📎 Photo and video attachments
- 🔄 Real-time updates
- 📅 Message scheduling

## Architecture

This app follows **Clean Architecture** principles with the following layers:

### Presentation Layer
- **BLoC** for state management
- **Provider** for dependency injection
- Pages and Widgets

### Domain Layer
- Entities (business models)
- Use Cases (business logic)
- Repository interfaces

### Data Layer
- Repository implementations
- Data sources (Remote & Local)
- Models (API models)

### Core Layer
- Constants
- Errors
- Network utilities
- Common utilities

## Project Structure

```
lib/
├── core/
│   ├── constants/
│   ├── errors/
│   ├── network/
│   ├── usecases/
│   └── utils/
├── data/
│   ├── datasources/
│   ├── models/
│   └── repositories/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── usecases/
└── presentation/
    ├── bloc/
    ├── pages/
    └── widgets/

test/
├── unit/
├── integration/
└── widget/
```

## Getting Started

### Prerequisites

- Flutter SDK >= 3.0.0
- Firebase project configured

### Installation

```bash
cd slowchat_flutter
flutter pub get
```

### Configuration

1. Add your Firebase configuration files:
   - `android/app/google-services.json`
   - `ios/Runner/GoogleService-Info.plist`

2. Run the app:

```bash
flutter run
```

### Testing

```bash
# Run all tests
flutter test

# Run with coverage
flutter test --coverage

# Run integration tests
flutter test integration_test
```

## Dependencies

- **flutter_bloc**: State management
- **provider**: Dependency injection
- **firebase_core**: Firebase initialization
- **firebase_auth**: Authentication
- **cloud_firestore**: Database
- **firebase_storage**: File storage
- **dio**: HTTP client
- **equatable**: Value equality

## License

MIT
