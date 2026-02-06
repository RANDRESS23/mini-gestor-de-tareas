<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->token = JWTAuth::fromUser($this->user);
    }

    public function test_user_can_list_their_tasks()
    {
        $tasks = Task::factory()->count(3)->create(['user_id' => $this->user->id]);
        Task::factory()->count(2)->create(); // Tasks for other users

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/tasks');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'tasks' => [
                        '*' => [
                            'id',
                            'user_id',
                            'title',
                            'description',
                            'status',
                            'created_at',
                            'updated_at'
                        ]
                    ]
                ]
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Tasks retrieved successfully'
            ]);

        $responseData = $response->json();
        $this->assertCount(3, $responseData['data']['tasks']);
    }

    public function test_unauthenticated_user_cannot_list_tasks()
    {
        $response = $this->getJson('/api/tasks');

        $response->assertStatus(401);
    }

    public function test_user_can_create_task()
    {
        $taskData = [
            'title' => 'New Task',
            'description' => 'Task description',
            'status' => 'pending',
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/tasks', $taskData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'task' => [
                        'id',
                        'user_id',
                        'title',
                        'description',
                        'status',
                        'created_at',
                        'updated_at'
                    ]
                ]
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Task created successfully',
                'data' => [
                    'task' => [
                        'title' => 'New Task',
                        'description' => 'Task description',
                        'status' => 'pending',
                        'user_id' => $this->user->id
                    ]
                ]
            ]);

        $this->assertDatabaseHas('tasks', [
            'title' => 'New Task',
            'description' => 'Task description',
            'status' => 'pending',
            'user_id' => $this->user->id
        ]);
    }

    public function test_unauthenticated_user_cannot_create_task()
    {
        $taskData = [
            'title' => 'New Task',
            'description' => 'Task description',
            'status' => 'pending',
        ];

        $response = $this->postJson('/api/tasks', $taskData);

        $response->assertStatus(401);
    }

    public function test_user_can_update_their_task()
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $updateData = [
            'title' => 'Updated Task',
            'description' => 'Updated description',
            'status' => 'done',
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->putJson("/api/tasks/{$task->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'task' => [
                        'id',
                        'user_id',
                        'title',
                        'description',
                        'status',
                        'created_at',
                        'updated_at'
                    ]
                ]
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Task updated successfully',
                'data' => [
                    'task' => [
                        'title' => 'Updated Task',
                        'description' => 'Updated description',
                        'status' => 'done'
                    ]
                ]
            ]);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated Task',
            'description' => 'Updated description',
            'status' => 'done'
        ]);
    }

    public function test_user_cannot_update_other_users_task()
    {
        $otherUser = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $otherUser->id]);

        $updateData = [
            'title' => 'Updated Task',
            'description' => 'Updated description',
            'status' => 'done',
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->putJson("/api/tasks/{$task->id}", $updateData);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Task not found or does not belong to user'
            ]);
    }

    public function test_unauthenticated_user_cannot_update_task()
    {
        $task = Task::factory()->create();

        $updateData = [
            'title' => 'Updated Task',
            'description' => 'Updated description',
            'status' => 'done',
        ];

        $response = $this->putJson("/api/tasks/{$task->id}", $updateData);

        $response->assertStatus(401);
    }

    public function test_user_can_delete_their_task()
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Task deleted successfully'
            ]);

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_user_cannot_delete_other_users_task()
    {
        $otherUser = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Task not found or does not belong to user'
            ]);

        $this->assertDatabaseHas('tasks', ['id' => $task->id]);
    }

    public function test_unauthenticated_user_cannot_delete_task()
    {
        $task = Task::factory()->create();

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(401);
    }

    public function test_task_creation_requires_title()
    {
        $taskData = [
            'description' => 'Task description',
            'status' => 'pending',
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/tasks', $taskData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    public function test_task_update_validates_status()
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $updateData = [
            'title' => 'Updated Task',
            'status' => 'done',
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->putJson("/api/tasks/{$task->id}", $updateData);

        $response->assertStatus(200);
    }

    public function test_user_cannot_access_nonexistent_task()
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->putJson("/api/tasks/999", [
                'title' => 'Test',
                'status' => 'done'
            ]);

        $response->assertStatus(404);
    }
}
