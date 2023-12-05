// This file contains the Marker and MarkerId classes, which are used to define markers for XMind.
// The Marker class contains static properties for different types of markers, such as Priority, Smiley, Task, Flag, Star, People, Arrow, Month, and Week.

// To use a marker, simply reference the appropriate property of the Marker class, such as Marker.Priority.p1.

import { isSameGroupWith } from './internal/marker'

export class MarkerId {
  readonly id: `${string}-${string}`
  constructor(id: `${string}-${string}`) {
    this.id = id
  }

  public isSameGroup(markerId: MarkerId): boolean {
    return isSameGroupWith(this, markerId)
  }
}

export class Marker {
  static Priority = {
    p1: new MarkerId('priority-1'),
    p2: new MarkerId('priority-2'),
    p3: new MarkerId('priority-3'),
    p4: new MarkerId('priority-4'),
    p5: new MarkerId('priority-5'),
    p6: new MarkerId('priority-6'),
    p7: new MarkerId('priority-7')
  }
  static Smiley = {
    laugh: new MarkerId('smiley-laugh'),
    smile: new MarkerId('smiley-smile'),
    cry: new MarkerId('smiley-cry'),
    surprise: new MarkerId('smiley-surprise'),
    boring: new MarkerId('smiley-boring'),
    angry: new MarkerId('smiley-angry'),
    embarrass: new MarkerId('smiley-embarrass')
  }
  static Task = {
    start: new MarkerId('task-start'),
    oct: new MarkerId('task-oct'),
    quarter: new MarkerId('task-quarter'),
    half: new MarkerId('task-half'),
    done: new MarkerId('task-done'),
    pause: new MarkerId('task-pause')
  }
  static Flag = {
    red: new MarkerId('flag-red'),
    orange: new MarkerId('flag-orange'),
    darkBlue: new MarkerId('flag-dark-blue'),
    purple: new MarkerId('flag-purple'),
    green: new MarkerId('flag-green'),
    blue: new MarkerId('flag-blue'),
    gray: new MarkerId('flag-gray')
  }
  static Star = {
    red: new MarkerId('star-red'),
    orange: new MarkerId('star-orange'),
    darkBlue: new MarkerId('star-dark-blue'),
    purple: new MarkerId('star-purple'),
    green: new MarkerId('star-green'),
    blue: new MarkerId('star-blue'),
    gray: new MarkerId('star-gray')
  }
  static People = {
    red: new MarkerId('people-red'),
    orange: new MarkerId('people-orange'),
    darkBlue: new MarkerId('people-dark-blue'),
    purple: new MarkerId('people-purple'),
    green: new MarkerId('people-green'),
    blue: new MarkerId('people-blue'),
    gray: new MarkerId('people-gray')
  }
  static Arrow = {
    left: new MarkerId('arrow-left'),
    right: new MarkerId('arrow-right'),
    up: new MarkerId('arrow-up'),
    down: new MarkerId('arrow-down'),
    leftRight: new MarkerId('arrow-left-right'),
    upDown: new MarkerId('arrow-up-down'),
    refresh: new MarkerId('arrow-refresh')
  }
  static Month = {
    jan: new MarkerId('month-jan'),
    feb: new MarkerId('month-feb'),
    mar: new MarkerId('month-mar'),
    apr: new MarkerId('month-apr'),
    may: new MarkerId('month-may'),
    jun: new MarkerId('month-jun'),
    jul: new MarkerId('month-jul'),
    sep: new MarkerId('month-sep'),
    oct: new MarkerId('month-oct'),
    nov: new MarkerId('month-nov'),
    dec: new MarkerId('month-dec')
  }
  static Week = {
    sun: new MarkerId('week-sun'),
    mon: new MarkerId('week-mon'),
    tue: new MarkerId('week-tue'),
    web: new MarkerId('week-web'),
    thu: new MarkerId('week-thu'),
    fri: new MarkerId('week-fri'),
    sat: new MarkerId('week-sat')
  }
}

