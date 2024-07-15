import { Outlet } from 'react-router-dom';

const Root = () => {
    return (
        <main className="max-w-[1920px] h-screen mx-auto bg-takaBG bg-fixed bg-center bg-cover bg-no-repeat text-white overflow-x-hidden overflow-y-auto taka-scrollbar">
            <Outlet />
        </main>
    );
};

export default Root;