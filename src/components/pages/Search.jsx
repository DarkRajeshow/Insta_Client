import { useState } from 'react';
import { toast } from 'sonner';
import UserSearchCard from '../reusable/UserSearchCard';
import { searchUsersAPI } from '../../utility/apiUtils';

const Search = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");


    const searchUsers = async (event) => {
        setLoading(true);
        setQuery(event.target.value)

        if (event.target.value === "") {
            setSearchResults([]);
            setLoading(false);
            return;
        }


        if (query !== "") {
            try {
                const { data } = await searchUsersAPI(query);
                if (data.success) {
                    setSearchResults(data.users);
                }
                else {
                    toast.error(data.status);
                }
            }

            catch (error) {
                console.error('Error fetching search results:', error);
            }
        }

        setLoading(false);
    };

    return (
        <div className="w-full min-h-[85vh] max-w-[800px] m-auto my-4">
            <div className='px-6'>
                <div className="bg-zinc-800 flex sm:text-xl items-center justify-between rounded-full py-3 px-5 sm:py-4 sm:px-5 gap-1">
                    <i className="text-white ri-search-line text-xl sm:text-2xl"></i>
                    <input
                        value={query}
                        onInput={searchUsers}
                        autoCapitalize="false"
                        autoComplete="off"
                        id="searchInput"
                        className="ml-1 w-full bg-transparent outline-none text-light placeholder:text-zinc-600"
                        type="text"
                        placeholder="Search with username, name"
                    />
                    {loading &&
                        <i className="ri-refresh-line animate-spin text-2xl text-light/60"></i>}
                </div>
            </div>
            <div id="users" className="users h-[65vh] flex flex-col mx-4 px-2 sm:px-4 gap-4 my-4 sm:my-10 overflow-auto bg-zinc-800/5 py-2 sm:py-4 rounded-3xl">
                {searchResults.map((user) => (
                    <UserSearchCard key={user._id} user={user} />
                ))}
                {searchResults.length === 0 && (
                    <div className='w-full h-full flex items-center justify-center text-center text-light text-2xl flex-col gap-2 bg-zinc-800/20 rounded-xl select-none text-muted-foreground'>
                        <i className="ri-search-eye-line text-2xl sm:text-3xl"></i>
                        <h3 className='text-sm sm:text-base font-semibold'>No results</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
