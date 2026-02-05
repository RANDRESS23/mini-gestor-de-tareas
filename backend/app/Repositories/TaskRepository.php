<?php

namespace App\Repositories;

use App\Models\Task;
use App\Models\User;

class TaskRepository
{
    /**
     * Get all tasks for a specific user.
     *
     * @param User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function allByUser(User $user)
    {
        return Task::where('user_id', $user->id)->get();
    }

    /**
     * Create a new task.
     *
     * @param array $data
     * @return Task
     */
    public function create(array $data): Task
    {
        return Task::create($data);
    }

    /**
     * Update a task.
     *
     * @param Task $task
     * @param array $data
     * @return Task
     */
    public function update(Task $task, array $data): Task
    {
        $task->update($data);
        return $task;
    }

    /**
     * Delete a task.
     *
     * @param Task $task
     * @return bool
     */
    public function delete(Task $task): bool
    {
        return $task->delete();
    }

    /**
     * Find task by ID.
     *
     * @param int $id
     * @return Task|null
     */
    public function findById(int $id): ?Task
    {
        return Task::find($id);
    }

    /**
     * Find task by ID and verify it belongs to the user.
     *
     * @param int $id
     * @param User $user
     * @return Task|null
     */
    public function findByIdAndUser(int $id, User $user): ?Task
    {
        return Task::where('id', $id)->where('user_id', $user->id)->first();
    }
}
