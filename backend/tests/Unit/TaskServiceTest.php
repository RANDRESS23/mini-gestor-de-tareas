<?php

namespace Tests\Unit;

use App\Http\Requests\Task\TaskStoreRequest;
use App\Http\Requests\Task\TaskUpdateRequest;
use App\Models\Task;
use App\Models\User;
use App\Repositories\TaskRepository;
use App\Services\TaskService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskServiceTest extends TestCase
{
    use RefreshDatabase;

    protected TaskService $taskService;
    protected TaskRepository $taskRepository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->taskRepository = new TaskRepository();
        $this->taskService = new TaskService($this->taskRepository);
    }

    public function test_listar_returns_user_tasks()
    {
        $user = User::factory()->create();
        Task::factory()->count(3)->create(['user_id' => $user->id]);
        Task::factory()->count(2)->create(); // Tasks for other users

        $result = $this->taskService->listar($user);

        $this->assertCount(3, $result);
        foreach ($result as $task) {
            $this->assertEquals($user->id, $task->user_id);
        }
    }

    public function test_crear_creates_new_task()
    {
        $user = User::factory()->create();
        $taskData = [
            'title' => 'New Task',
            'description' => 'Task description',
            'status' => 'pending',
        ];

        $request = $this->getMockBuilder(TaskStoreRequest::class)
            ->disableOriginalConstructor()
            ->getMock();
        $request->expects($this->once())
            ->method('validated')
            ->willReturn($taskData);

        $result = $this->taskService->crear($request, $user);

        $this->assertInstanceOf(Task::class, $result);
        $this->assertEquals('New Task', $result->title);
        $this->assertEquals('Task description', $result->description);
        $this->assertEquals('pending', $result->status);
        $this->assertEquals($user->id, $result->user_id);

        $this->assertDatabaseHas('tasks', [
            'title' => 'New Task',
            'description' => 'Task description',
            'status' => 'pending',
            'user_id' => $user->id
        ]);
    }

    public function test_actualizar_updates_task()
    {
        $task = Task::factory()->create([
            'title' => 'Original Task',
            'description' => 'Original description',
            'status' => 'pending'
        ]);

        $updateData = [
            'title' => 'Updated Task',
            'description' => 'Updated description',
            'status' => 'done',
        ];

        $request = $this->getMockBuilder(TaskUpdateRequest::class)
            ->disableOriginalConstructor()
            ->getMock();
        $request->expects($this->once())
            ->method('validated')
            ->willReturn($updateData);

        $result = $this->taskService->actualizar($request, $task);

        $this->assertInstanceOf(Task::class, $result);
        $this->assertEquals('Updated Task', $result->title);
        $this->assertEquals('Updated description', $result->description);
        $this->assertEquals('done', $result->status);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated Task',
            'description' => 'Updated description',
            'status' => 'done'
        ]);
    }

    public function test_eliminar_deletes_task()
    {
        $task = Task::factory()->create();

        $result = $this->taskService->eliminar($task);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_findByIdAndUser_returns_task_when_found()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $result = $this->taskService->findByIdAndUser($task->id, $user);

        $this->assertInstanceOf(Task::class, $result);
        $this->assertEquals($task->id, $result->id);
        $this->assertEquals($user->id, $result->user_id);
    }

    public function test_findByIdAndUser_returns_null_when_not_found()
    {
        $user = User::factory()->create();
        Task::factory()->create(); // Create task for different user

        $result = $this->taskService->findByIdAndUser(999, $user);

        $this->assertNull($result);
    }

    public function test_findByIdAndUser_returns_null_for_other_users_task()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user1->id]);

        $result = $this->taskService->findByIdAndUser($task->id, $user2);

        $this->assertNull($result);
    }

    public function test_crear_adds_user_id_to_data()
    {
        $user = User::factory()->create(['id' => 123]);
        $taskData = [
            'title' => 'New Task',
            'description' => 'Task description',
            'status' => 'pending',
        ];

        $request = $this->getMockBuilder(TaskStoreRequest::class)
            ->disableOriginalConstructor()
            ->getMock();
        $request->expects($this->once())
            ->method('validated')
            ->willReturn($taskData);

        $result = $this->taskService->crear($request, $user);

        $this->assertEquals(123, $result->user_id);
    }

    public function test_actualizar_only_updates_provided_fields()
    {
        $task = Task::factory()->create([
            'title' => 'Original Task',
            'description' => 'Original description',
            'status' => 'pending'
        ]);

        $updateData = [
            'status' => 'done',
        ];

        $request = $this->getMockBuilder(TaskUpdateRequest::class)
            ->disableOriginalConstructor()
            ->getMock();
        $request->expects($this->once())
            ->method('validated')
            ->willReturn($updateData);

        $result = $this->taskService->actualizar($request, $task);

        $this->assertEquals('Original Task', $result->title);
        $this->assertEquals('Original description', $result->description);
        $this->assertEquals('done', $result->status);
    }
}
