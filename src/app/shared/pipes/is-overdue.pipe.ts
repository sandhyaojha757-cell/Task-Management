// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({ name: 'isOverdue' })
// export class IsOverduePipe implements PipeTransform {
//   transform(dueDate: string | Date): boolean {
//     const d = new Date(dueDate);
//     const now = new Date();
//     if(i)red/orange/blue
//     return d < now;
    
//   }
// }
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'isOverdue' })
export class IsOverduePipe implements PipeTransform {
  transform(dueDate: string | Date): string {
    const d = new Date(dueDate);
    const now = new Date();

    // remove time part for comparison
    d.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffMs = d.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'red';   // overdue
    } else if (diffDays <= 10) {
      return 'orange'; // due soon
    } else {
      return 'blue';  // plenty of time
    }
  }
}
