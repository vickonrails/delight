
export const TopTabs = () => {
    return (
        <div className="flex justify-around border-b border-gray-700">
            <div className="text-center flex-1 cursor-pointer hover:bg-[#16181C]">
                <div className="border-b-4 border-blue-500 inline-block py-4">
                    For you
                </div>
            </div>
            <div className="text-center flex-1 cursor-pointer hover:bg-[#16181C] py-4">
                Following
            </div>
            <div>
                <i className="fas fa-cog">
                </i>
            </div>
        </div>
    )
}