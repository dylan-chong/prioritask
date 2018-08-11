import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../providers/user-service/user-service';
import * as moment from 'moment';

interface TaskPair {
  key: string;
  value: Task;
}

interface TaskGroup {
  title: string;
  tasks: TaskPair[];
}

@Pipe({
  name: 'groupTasks',
})
export class GroupTasksPipe implements PipeTransform {

  transform(tasks: TaskPair[]): TaskGroup[] {
    if (tasks.length === 0) {
      return [];
    }

    const groups = groupers
      .map(grouper => grouper(tasks))
      .filter(group => group.tasks.length > 0);
    return groups;
  }

}

// TODO move all of these functions into better places, considering layers

const isOverdue = (task: Task) => {
  const due = new Date(task.dueDate);
  return due.getTime() > Date.now();
};

const groupers: ((tasks: TaskPair[]) => TaskGroup)[] = [
  (taskPairs) => ({
    title: 'Overdue',
    tasks: taskPairs.filter(({ value: task }) => 
      isOverdue(task)
    ),
  }),
  (taskPairs) => ({
    title: 'Due Later Today',
    tasks: taskPairs.filter(({ value: task }) => 
      moment().isSame(task.dueDate, 'day') && !isOverdue(task)
    ),
  }),
  (taskPairs) => ({
    title: 'Due Tomorrow',
    tasks: taskPairs.filter(({ value: task }) => 
      moment().add(1, 'days').isSame(task.dueDate, 'day')
    ),
  }),
  (taskPairs) => ({
    title: 'Due Some Other Time',
    tasks: taskPairs.filter(({ value: task }) => 
      moment().add(1, 'days').isBefore(task.dueDate, 'day')
    ),
  }),
];
