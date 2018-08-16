import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { isOverdue } from '../../providers/tasks-service/tasks-service';
import { TaskPair, TaskGroup } from '../../providers/settings-service/settings-service';

@Pipe({
  name: 'groupTasks',
})
export class GroupTasksPipe implements PipeTransform {

  transform(tasks: TaskPair[], taskFilters: any[] = []): TaskGroup[] {
    taskFilters.forEach(filter => 
      tasks = filter(tasks)
    );

    if (tasks.length === 0) {
      return [];
    }

    const groups = groupers
      .map(grouper => grouper(tasks))
      .filter(group => group.tasks.length > 0);
    return groups;
  }

}

const groupers: ((tasks: TaskPair[]) => TaskGroup)[] = [
  (taskPairs) => ({
    title: 'Due',
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
    title: 'Due the Day After Tomorrow',
    tasks: taskPairs.filter(({ value: task }) => 
      moment().add(2, 'days').isSame(task.dueDate, 'day')
    ),
  }),
  (taskPairs) => ({
    title: 'Due Some Other Time',
    tasks: taskPairs.filter(({ value: task }) => 
      moment().add(2, 'days').isBefore(task.dueDate, 'day')
    ),
  }),
];
