import {Skeleton} from "@heroui/skeleton";


export default function TaskDetailsSkeleton() {
  return (
    <>
      <Skeleton className="rounded-lg h-7"/>
      <Skeleton className="rounded-lg h-6 w-[10rem] mt-3"/>
      <Skeleton className="rounded-lg h-5 w-[7rem] mt-10"/>
      <Skeleton className="rounded-lg h-[10rem] w-full mt-5"/>
    </>
  )
}
