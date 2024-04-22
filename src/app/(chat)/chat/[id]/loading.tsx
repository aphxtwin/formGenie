import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <div className="grid grid-cols-2 min-h-screen space-x-3 p-5">
            <div className="space-y-3 justify-start">

                    <Skeleton className="h-[37px] w-[500px] bg-zinc-300" />
                    <Skeleton className="h-[37px] w-[300px] bg-zinc-300" />
                    <Skeleton className="h-[37px] w-[300px] bg-zinc-300" />

            </div>
            <div className="flex flex-col items-center space-y-3">
                <Skeleton className="h-[47px] w-[500px] bg-zinc-300" />
                <Skeleton className="h-[505px] w-[450px] rounded-xl bg-zinc-300" />
            </div>
        </div>
    ) 
}

export default Loading;