<?php

namespace Tests\Unit;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\AuthService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthServiceTest extends TestCase
{
    use RefreshDatabase;

    protected AuthService $authService;
    protected UserRepository $userRepository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userRepository = new UserRepository();
        $this->authService = new AuthService($this->userRepository);
    }

    public function test_register_creates_user_and_returns_token()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
        ];

        $request = $this->getMockBuilder(RegisterRequest::class)
            ->disableOriginalConstructor()
            ->getMock();
        $request->expects($this->once())
            ->method('validated')
            ->willReturn($userData);

        $result = $this->authService->register($request);

        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('token', $result);
        $this->assertInstanceOf(User::class, $result['user']);
        $this->assertIsString($result['token']);

        $this->assertEquals('John Doe', $result['user']->name);
        $this->assertEquals('john@example.com', $result['user']->email);

        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ]);

        $this->assertTrue(Hash::check('password123', $result['user']->password));
    }

    public function test_login_returns_user_and_token_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'john@example.com',
            'password' => Hash::make('password123')
        ]);

        $credentials = [
            'email' => 'john@example.com',
            'password' => 'password123'
        ];

        $request = $this->getMockBuilder(LoginRequest::class)
            ->disableOriginalConstructor()
            ->getMock();
        $request->expects($this->once())
            ->method('only')
            ->with('email', 'password')
            ->willReturn($credentials);

        $result = $this->authService->login($request);

        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('token', $result);
        $this->assertInstanceOf(User::class, $result['user']);
        $this->assertIsString($result['token']);
        $this->assertEquals($user->id, $result['user']->id);
    }

    public function test_login_throws_exception_with_invalid_credentials()
    {
        $credentials = [
            'email' => 'john@example.com',
            'password' => 'wrongpassword'
        ];

        $request = $this->getMockBuilder(LoginRequest::class)
            ->disableOriginalConstructor()
            ->getMock();
        $request->expects($this->once())
            ->method('only')
            ->with('email', 'password')
            ->willReturn($credentials);

        $this->expectException(HttpResponseException::class);

        $this->authService->login($request);
    }

    public function test_me_returns_authenticated_user()
    {
        $user = User::factory()->create();
        Auth::shouldReceive('user')->once()->andReturn($user);

        $result = $this->authService->me();

        $this->assertInstanceOf(User::class, $result);
        $this->assertEquals($user->id, $result->id);
    }

    public function test_me_returns_null_when_no_authenticated_user()
    {
        Auth::shouldReceive('user')->once()->andReturn(null);

        $result = $this->authService->me();

        $this->assertNull($result);
    }

    public function test_logout_invalidates_token()
    {
        Auth::shouldReceive('logout')->once();

        $result = $this->authService->logout();

        $this->assertTrue($result);
    }

    public function test_register_hashes_password()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
        ];

        $request = $this->getMockBuilder(RegisterRequest::class)
            ->disableOriginalConstructor()
            ->getMock();
        $request->expects($this->once())
            ->method('validated')
            ->willReturn($userData);

        $result = $this->authService->register($request);

        $this->assertNotEquals('password123', $result['user']->password);
        $this->assertTrue(Hash::check('password123', $result['user']->password));
    }

    public function test_login_with_nonexistent_user_throws_exception()
    {
        $credentials = [
            'email' => 'nonexistent@example.com',
            'password' => 'password123'
        ];

        $request = $this->getMockBuilder(LoginRequest::class)
            ->disableOriginalConstructor()
            ->getMock();
        $request->expects($this->once())
            ->method('only')
            ->with('email', 'password')
            ->willReturn($credentials);

        $this->expectException(HttpResponseException::class);

        $this->authService->login($request);
    }

    public function test_login_with_wrong_password_throws_exception()
    {
        $user = User::factory()->create([
            'email' => 'john@example.com',
            'password' => Hash::make('password123')
        ]);

        $credentials = [
            'email' => 'john@example.com',
            'password' => 'wrongpassword'
        ];

        $request = $this->getMockBuilder(LoginRequest::class)
            ->disableOriginalConstructor()
            ->getMock();
        $request->expects($this->once())
            ->method('only')
            ->with('email', 'password')
            ->willReturn($credentials);

        $this->expectException(HttpResponseException::class);

        $this->authService->login($request);
    }

    public function test_register_creates_user_with_correct_data()
    {
        $userData = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'securepassword',
        ];

        $request = $this->getMockBuilder(RegisterRequest::class)
            ->disableOriginalConstructor()
            ->getMock();
        $request->expects($this->once())
            ->method('validated')
            ->willReturn($userData);

        $result = $this->authService->register($request);

        $this->assertEquals('Jane Doe', $result['user']->name);
        $this->assertEquals('jane@example.com', $result['user']->email);
        $this->assertNotNull($result['user']->created_at);
        $this->assertNotNull($result['user']->updated_at);
    }
}
