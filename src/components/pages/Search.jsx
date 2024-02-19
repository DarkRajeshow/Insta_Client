import { useState } from 'react';
import { toast } from 'sonner';
import UserSearchCard from '../reusable/UserSearchCard';
import api from '../../assets/api';

const Search = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");


    const searchUser = async (event) => {
        setLoading(true);
        setQuery(event.target.value)

        if (event.target.value === "") {
            setSearchResults([]);
            setLoading(false);
            return;
        }



        if (query !== "") {
            try {
                const { data } = await api.get(`/api/search/${query}`);
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
        <div className="w-full min-h-[85vh] max-w-[50vw] m-auto">
            <div className='px-4'>
                <div className="bg-zinc-800 flex text-xl items-center justify-between rounded-full py-4 px-5 gap-1">
                    <i className="text-white ri-search-line text-2xl"></i>
                    <input
                        value={query}
                        onInput={searchUser}
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
            <div id="users" className="users h-[65vh] flex flex-col px-4 gap-4 my-10 overflow-auto bg-zinc-800/5 py-4 rounded-3xl">
                {searchResults.map((user) => (
                    <UserSearchCard key={user._id} user={user} />
                ))}
                {searchResults.length === 0 && (
                    <div className='w-full h-full flex items-center justify-center text-center text-light text-2xl flex-col gap-2 bg-zinc-800/20 rounded-xl select-none text-muted-foreground'>
                        <i className="ri-search-eye-line text-3xl"></i>
                        <h3 className='font-semibold'>No results</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
