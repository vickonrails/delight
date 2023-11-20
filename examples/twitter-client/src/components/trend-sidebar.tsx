import { MoreVertical, Search } from 'react-feather'
import { trends } from '../utils/dummy-trends'

export const TrendSidebar = () => {
    return (
        <div className="container mx-auto px-4">
            <div className="flex items-center rounded-full p-2 my-4 gap-3 bg-[#16181C]">
                <Search />
                <input type="text" placeholder="Search" className="bg-transparent focus:outline-none text-white w-full" />
            </div>
            <div className="bg-[#16181C] rounded-lg p-4">
                <div className="mb-4">
                    <h2 className="text-lg font-bold">Trends for you</h2>
                </div>
                <div>
                    {trends.map(trend => (
                        <div className="pb-4 flex items-center justify-between" key={trend.title}>
                            <div key={trend.title}>
                                <p className="text-gray-500 text-sm">{trend.subtitle}</p>
                                <p className="font-bold text-sm">{trend.title}</p>
                                <p className="text-gray-500 text-sm">{trend.postCount} posts</p>
                            </div>
                            <button className='text-gray-600'>
                                <MoreVertical size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TrendSidebar