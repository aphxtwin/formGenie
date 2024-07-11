import { cn } from "@/lib/utils";

function IconAI({ className, ...props }: React.ComponentProps<'svg'>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={cn('w-6 h-6', className)}
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
            />
        </svg>
    );
}

function Puertita(){
  return(
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 12.5833L12 7.99999L7 3.41666V6.16666H0V9.83332H7V12.5833ZM16 0.666656H6V2.49999H16V13.5H6V15.3333H16C16.5304 15.3333 17.0391 15.1402 17.4142 14.7964C17.7893 14.4525 18 13.9862 18 13.5V2.49999C18 2.01376 17.7893 1.54744 17.4142 1.20363C17.0391 0.859811 16.5304 0.666656 16 0.666656Z" fill="white"/>
    </svg>
  )
}

function IconUser({ className, ...props }: React.ComponentProps<'svg'>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className={cn('size-4', className)}
        viewBox="0 0 256 256"
        {...props}
      >
        <path d="M117.25 157.92a60 60 0 1 0-66.5 0 95.83 95.83 0 0 0-47.22 37.71 8 8 0 1 0 13.4 8.74 80 80 0 0 1 134.14 0 8 8 0 0 0 13.4-8.74 95.83 95.83 0 0 0-47.22-37.71ZM40 108a44 44 0 1 1 44 44 44.05 44.05 0 0 1-44-44Zm210.14 98.7a8 8 0 0 1-11.07-2.33A79.83 79.83 0 0 0 172 168a8 8 0 0 1 0-16 44 44 0 1 0-16.34-84.87 8 8 0 1 1-5.94-14.85 60 60 0 0 1 55.53 105.64 95.83 95.83 0 0 1 47.22 37.71 8 8 0 0 1-2.33 11.07Z" />
      </svg>
    )
}

function IconSpinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4 animate-spin', className)}
      {...props}
    >
      <path d="M232 128a104 104 0 0 1-208 0c0-41 23.81-78.36 60.66-95.27a8 8 0 0 1 6.68 14.54C60.15 61.59 40 93.27 40 128a88 88 0 0 0 176 0c0-34.73-20.15-66.41-51.34-80.73a8 8 0 0 1 6.68-14.54C208.19 49.64 232 87 232 128Z" />
    </svg>
  )
}
export {IconAI, IconUser, IconSpinner, Puertita}