import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../providers/user-service/user-service';

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

    return groupers
      .map(grouper => grouper(tasks))
      .filter(group => group.tasks.length > 0);
  }

}

// TODO move all of these functions into better places, considering layers

// https://stackoverflow.com/a/43855221/1726450
const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
};

const isOverdue = (task: Task) => {
  const due = new Date(task.dueDate);
  return due.getTime() > Date.now();
};

const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
}

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
      isSameDay(task.dueDate, new Date()) && !isOverdue(task)
    ),
  }),
  (taskPairs) => ({
    title: 'Due Tomorrow',
    tasks: taskPairs.filter(({ value: task }) => 
      isSameDay(task.dueDate, tomorrow())
    ),
  }),
  (taskPairs) => ({
    title: 'Due Some Other Time',
    tasks: taskPairs.filter(({ value: task }) => 
      !isSameDay(task.dueDate, tomorrow()) 
      && task.dueDate.getTime() > tomorrow().getTime()
    ),
  }),
];

// TODO make tests instances
