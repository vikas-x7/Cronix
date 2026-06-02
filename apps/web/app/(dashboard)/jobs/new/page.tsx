import { redirect } from 'next/navigation';

export default function OldCreateJobRedirect() {
  redirect('/schedule');
}
