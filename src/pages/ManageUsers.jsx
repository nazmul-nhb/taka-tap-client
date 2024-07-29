import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { MdBlock, MdOutlinePendingActions, MdVerifiedUser } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa6";
import TakaTable from "../components/TakaTable";
import useUpdateUser from "../hooks/useUpdateUser";
import Loader from "../shared/Loader";

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const updateUser = useUpdateUser();

    const { isLoading, data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users`);
            return res.data;
        }
    });

    const handleActivateUser = (name, email, type) => {
        const user = { account_status: 'active', balance: type === 'user' ? 40 : 10000 };
        const msg = `${name}'s Account is Activated!`;

        updateUser(email, user, msg, refetch);
    };

    const handleUnblockUser = (name, email) => {
        const user = { account_status: 'active' };
        const msg = `${name}'s Account is Unblocked!`;

        updateUser(email, user, msg, refetch);
    };

    const handleBlockUser = (name, email) => {
        const user = { account_status: 'blocked' };
        const msg = `${name}'s Account is Blocked!`;

        updateUser(email, user, msg, refetch);
    };

    const usersWithSerial = users?.map((user, index) => ({ ...user, serial: index + 1 }));
    const userData = useMemo(() => usersWithSerial, [usersWithSerial]);

    /** @type import('@tanstack/react-table').ColumnDef<any> */
    const userColumns = [
        {
            header: '#',
            accessorKey: 'serial',
        },
        {
            header: 'Name',
            accessorKey: 'name'
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Mobile',
            accessorKey: 'mobile',
        },
        {
            header: 'Status',
            accessorKey: 'account_status',
            cell: (cell) => {
                return (<>{
                    cell.row.original.account_status === 'pending'
                        ? <h3 className="flex items-center gap-1 font-bold text-lg text-green-100">
                            <MdOutlinePendingActions /> Pending
                        </h3>
                        : cell.row.original.account_status === 'blocked'
                            ? <h3 className="flex items-center gap-1 font-bold text-lg text-red-700">
                                <MdBlock /> Blocked
                            </h3>
                            : <h3 className="flex items-center gap-1 font-bold text-lg text-green-900">
                                <FaUserCheck /> Active
                            </h3>
                }</>)
            }
        },
        {
            header: 'Action',
            accessorKey: 'account_type',
            cell: (cell) => {
                const { name, email, account_type } = cell.row.original;
                return (<>{
                    cell.row.original.account_status === 'blocked'
                        ? <button className={`flex items-center gap-0.5 border border-green-900 px-3 py-0.5 rounded-3xl text-green-900 hover:text-white hover:bg-green-900 font-bold text-lg transition-all duration-500`} onClick={() => handleUnblockUser(name, email)}><MdVerifiedUser /> Unblock</button>
                        : cell.row.original.account_status === 'pending'
                            ? <button className={`flex items-center gap-0.5 border border-green-900 px-3 py-0.5 rounded-3xl text-green-900 hover:text-white hover:bg-green-900 font-bold text-lg transition-all duration-500`} onClick={() => handleActivateUser(name, email, account_type)}><MdVerifiedUser /> Activate</button>
                            : <button className={`flex items-center gap-0.5 border border-red-900 px-3 py-0.5 rounded-3xl text-red-900 hover:text-white hover:bg-red-900 font-bold text-lg transition-all duration-500`} onClick={() => handleBlockUser(name, email)}><MdBlock /> Block</button>
                }</>)
            }
        }
    ]

    if (isLoading) return <Loader />;

    return (
        <section className="m-4 md:m-8">
            <TakaTable data={userData} columns={userColumns} />
        </section>
    );
};

export default ManageUsers;