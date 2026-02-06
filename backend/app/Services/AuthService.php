<?php

namespace App\Services;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Register a new user.
     *
     * @param RegisterRequest $request
     * @return array
     */
    public function register(RegisterRequest $request): array
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        $user = $this->userRepository->create($data);
        $token = JWTAuth::fromUser($user);

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * Login user and return token.
     *
     * @param LoginRequest $request
     * @return array
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login(LoginRequest $request): array
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            throw new HttpResponseException(response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas',
                'errors' => [
                    'general' => ['Credenciales incorrectas']
                ]
            ], 422));
        }

        $user = Auth::user();

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * Get authenticated user.
     *
     * @return User|null
     */
    public function me(): ?User
    {
        return Auth::user();
    }

    /**
     * Logout user (invalidate token).
     *
     * @return bool
     */
    public function logout(): bool
    {
        Auth::logout();
        return true;
    }
}
