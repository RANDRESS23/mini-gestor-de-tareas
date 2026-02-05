<?php

namespace App\Http\Controllers;

use App\Http\Requests\Task\TaskStoreRequest;
use App\Http\Requests\Task\TaskUpdateRequest;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    protected TaskService $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    /**
     * Display a listing of the tasks.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $tasks = $this->taskService->listar($user);

            return response()->json([
                'success' => true,
                'message' => 'Tasks retrieved successfully',
                'data' => [
                    'tasks' => $tasks
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve tasks',
                'errors' => [
                    'general' => [$e->getMessage()]
                ]
            ], 500);
        }
    }

    /**
     * Store a newly created task.
     *
     * @param TaskStoreRequest $request
     * @return JsonResponse
     */
    public function store(TaskStoreRequest $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $task = $this->taskService->crear($request, $user);

            return response()->json([
                'success' => true,
                'message' => 'Task created successfully',
                'data' => [
                    'task' => $task
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create task',
                'errors' => [
                    'general' => [$e->getMessage()]
                ]
            ], 500);
        }
    }

    /**
     * Update the specified task.
     *
     * @param TaskUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(TaskUpdateRequest $request, int $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $task = $this->taskService->findByIdAndUser($id, $user);

            if (!$task) {
                return response()->json([
                    'success' => false,
                    'message' => 'Task not found or does not belong to user',
                    'errors' => []
                ], 404);
            }

            $updatedTask = $this->taskService->actualizar($request, $task);

            return response()->json([
                'success' => true,
                'message' => 'Task updated successfully',
                'data' => [
                    'task' => $updatedTask
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update task',
                'errors' => [
                    'general' => [$e->getMessage()]
                ]
            ], 500);
        }
    }

    /**
     * Remove the specified task.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $task = $this->taskService->findByIdAndUser($id, $user);

            if (!$task) {
                return response()->json([
                    'success' => false,
                    'message' => 'Task not found or does not belong to user',
                    'errors' => []
                ], 404);
            }

            $this->taskService->eliminar($task);

            return response()->json([
                'success' => true,
                'message' => 'Task deleted successfully',
                'data' => []
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete task',
                'errors' => [
                    'general' => [$e->getMessage()]
                ]
            ], 500);
        }
    }
}
