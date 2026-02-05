<?php

namespace App\Services;

use App\Http\Requests\Task\TaskStoreRequest;
use App\Http\Requests\Task\TaskUpdateRequest;
use App\Models\Task;
use App\Models\User;
use App\Repositories\TaskRepository;

class TaskService
{
    protected TaskRepository $taskRepository;

    public function __construct(TaskRepository $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    /**
     * List all tasks for a user.
     *
     * @param User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function listar(User $user)
    {
        return $this->taskRepository->allByUser($user);
    }

    /**
     * Create a new task.
     *
     * @param TaskStoreRequest $request
     * @param User $user
     * @return Task
     */
    public function crear(TaskStoreRequest $request, User $user): Task
    {
        $data = $request->validated();
        $data['user_id'] = $user->id;

        return $this->taskRepository->create($data);
    }

    /**
     * Update a task.
     *
     * @param TaskUpdateRequest $request
     * @param Task $task
     * @return Task
     */
    public function actualizar(TaskUpdateRequest $request, Task $task): Task
    {
        $data = $request->validated();

        return $this->taskRepository->update($task, $data);
    }

    /**
     * Delete a task.
     *
     * @param Task $task
     * @return bool
     */
    public function eliminar(Task $task): bool
    {
        return $this->taskRepository->delete($task);
    }

    /**
     * Find task by ID and verify ownership.
     *
     * @param int $id
     * @param User $user
     * @return Task|null
     */
    public function findByIdAndUser(int $id, User $user): ?Task
    {
        return $this->taskRepository->findByIdAndUser($id, $user);
    }
}
