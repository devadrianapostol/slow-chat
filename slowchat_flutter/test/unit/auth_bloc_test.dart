import 'package:flutter_test/flutter_test.dart';
import 'package:bloc_test/bloc_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:dartz/dartz.dart';
import 'package:slowchat_flutter/domain/entities/user.dart';
import 'package:slowchat_flutter/domain/usecases/sign_in.dart';
import 'package:slowchat_flutter/domain/usecases/sign_up.dart';
import 'package:slowchat_flutter/core/errors/failures.dart';
import 'package:slowchat_flutter/presentation/bloc/auth/auth_bloc.dart';

@GenerateMocks([SignIn, SignUp])
import 'auth_bloc_test.mocks.dart';

void main() {
  late AuthBloc authBloc;
  late MockSignIn mockSignIn;
  late MockSignUp mockSignUp;

  setUp(() {
    mockSignIn = MockSignIn();
    mockSignUp = MockSignUp();
    authBloc = AuthBloc(
      signIn: mockSignIn,
      signUp: mockSignUp,
    );
  });

  tearDown(() {
    authBloc.close();
  });

  const tUser = User(
    uid: '123',
    email: 'test@example.com',
    displayName: 'Test User',
  );

  group('SignInEvent', () {
    const tEmail = 'test@example.com';
    const tPassword = 'password123';

    test('initial state should be AuthInitial', () {
      expect(authBloc.state, equals(AuthInitial()));
    });

    blocTest<AuthBloc, AuthState>(
      'should emit [AuthLoading, AuthAuthenticated] when sign in is successful',
      build: () {
        when(mockSignIn(any)).thenAnswer((_) async => const Right(tUser));
        return authBloc;
      },
      act: (bloc) => bloc.add(SignInEvent(tEmail, tPassword)),
      expect: () => [
        AuthLoading(),
        AuthAuthenticated(tUser),
      ],
      verify: (_) {
        verify(mockSignIn(const SignInParams(email: tEmail, password: tPassword)));
      },
    );

    blocTest<AuthBloc, AuthState>(
      'should emit [AuthLoading, AuthError] when sign in fails',
      build: () {
        when(mockSignIn(any))
            .thenAnswer((_) async => const Left(AuthenticationFailure('Invalid credentials')));
        return authBloc;
      },
      act: (bloc) => bloc.add(SignInEvent(tEmail, tPassword)),
      expect: () => [
        AuthLoading(),
        AuthError('Invalid credentials'),
      ],
    );
  });

  group('SignUpEvent', () {
    const tEmail = 'newuser@example.com';
    const tPassword = 'password123';
    const tDisplayName = 'New User';

    blocTest<AuthBloc, AuthState>(
      'should emit [AuthLoading, AuthAuthenticated] when sign up is successful',
      build: () {
        when(mockSignUp(any)).thenAnswer((_) async => const Right(tUser));
        return authBloc;
      },
      act: (bloc) => bloc.add(SignUpEvent(tEmail, tPassword, tDisplayName)),
      expect: () => [
        AuthLoading(),
        AuthAuthenticated(tUser),
      ],
      verify: (_) {
        verify(mockSignUp(const SignUpParams(
          email: tEmail,
          password: tPassword,
          displayName: tDisplayName,
        )));
      },
    );

    blocTest<AuthBloc, AuthState>(
      'should emit [AuthLoading, AuthError] when sign up fails',
      build: () {
        when(mockSignUp(any))
            .thenAnswer((_) async => const Left(AuthenticationFailure('Email already exists')));
        return authBloc;
      },
      act: (bloc) => bloc.add(SignUpEvent(tEmail, tPassword, tDisplayName)),
      expect: () => [
        AuthLoading(),
        AuthError('Email already exists'),
      ],
    );
  });

  group('SignOutEvent', () {
    blocTest<AuthBloc, AuthState>(
      'should emit AuthUnauthenticated when sign out',
      build: () => authBloc,
      act: (bloc) => bloc.add(SignOutEvent()),
      expect: () => [AuthUnauthenticated()],
    );
  });
}
