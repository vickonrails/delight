import { hashColors } from "../utils/avatar-colors"

export function Avatar({ name, ...props }: { name: string } & React.AllHTMLAttributes<HTMLImageElement>) {
    const backgroundColor = hashColors(name)
    if (!props.src) return (
        <div
            className="w-10 h-10 rounded-full mr-3 uppercase select-none grid"
            style={{ backgroundColor }}
        >
            <p className="m-auto text-xl">
                {name.substring(0, 2)}
            </p>
        </div>
    )

    return (
        <img
            alt={name}
            style={{ backgroundColor }}
            className="w-10 h-10 rounded-full mr-3"
            height="40"
            width="40"
        />
    )
}