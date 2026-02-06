<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_task_can_be_created()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create([
            'user_id' => $user->id,
            'title' => 'Test Task',
            'description' => 'Test Description',
            'status' => 'pending',
        ]);

        $this->assertInstanceOf(Task::class, $task);
        $this->assertEquals('Test Task', $task->title);
        $this->assertEquals('Test Description', $task->description);
        $this->assertEquals('pending', $task->status);
        $this->assertEquals($user->id, $task->user_id);
    }

    public function test_task_fillable_attributes()
    {
        $user = User::factory()->create();
        $taskData = [
            'user_id' => $user->id,
            'title' => 'New Task',
            'description' => 'New Description',
            'status' => 'done',
        ];

        $task = Task::create($taskData);

        $this->assertEquals($taskData['user_id'], $task->user_id);
        $this->assertEquals($taskData['title'], $task->title);
        $this->assertEquals($taskData['description'], $task->description);
        $this->assertEquals($taskData['status'], $task->status);
    }

    public function test_task_belongs_to_user()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $task->user);
        $this->assertEquals($user->id, $task->user->id);
        $this->assertEquals($user->name, $task->user->name);
    }

    public function test_task_by_status_scope()
    {
        $user = User::factory()->create();

        Task::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending'
        ]);

        Task::factory()->create([
            'user_id' => $user->id,
            'status' => 'done'
        ]);

        Task::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending'
        ]);

        $pendingTasks = Task::byStatus('pending')->get();
        $doneTasks = Task::byStatus('done')->get();

        $this->assertCount(2, $pendingTasks);
        $this->assertCount(1, $doneTasks);

        foreach ($pendingTasks as $task) {
            $this->assertEquals('pending', $task->status);
        }

        foreach ($doneTasks as $task) {
            $this->assertEquals('done', $task->status);
        }
    }

    public function test_task_casts_dates()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(\Carbon\Carbon::class, $task->created_at);
        $this->assertInstanceOf(\Carbon\Carbon::class, $task->updated_at);
    }

    public function test_task_can_be_deleted()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $taskId = $task->id;
        $task->delete();

        $this->assertDatabaseMissing('tasks', ['id' => $taskId]);
    }

    public function test_task_factory_creates_valid_data()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $this->assertNotEmpty($task->title);
        $this->assertNotEmpty($task->description);
        $this->assertContains($task->status, ['pending', 'in_progress', 'done']);
        $this->assertEquals($user->id, $task->user_id);
    }
}
