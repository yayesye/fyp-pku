export default function Loading() {
    return (
        <div className="flex flex-col gap-6 justify-center items-center h-screen">
            <div className="w-20 h-20 border-4 border-primary-green border-t-transparent rounded-full animate-spin" />
            <h1 className="font-bold text-3xl text-primary-green">Loading</h1>
        </div>
    )
}