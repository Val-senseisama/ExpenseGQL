import { useQuery } from "@apollo/client";
import Card from "./Card";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query.js";
import toast from "react-hot-toast";
import { GET_AUTHENTICATED_USER, GET_USER_TRANSACTIONS } from "../graphql/queries/user.query.js";

const Cards = () => {
	const { data, loading, error} = useQuery(GET_TRANSACTIONS,{
		refetchQueries: ["GetTransactions"]
	});
	const {data: authUser} = useQuery(GET_AUTHENTICATED_USER);

	const {data: userTransactions} = useQuery(GET_USER_TRANSACTIONS, {
		variables: {userId: authUser?.authUser?._id }
	});

 console.log("userTransactions", userTransactions);
	if (error) return toast.error(error.message);

	return (
		<div className='w-full px-10 min-h-[40vh]'>
			<p className='text-5xl font-bold text-center my-10'>History</p>
			<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20'>
				{!loading &&
					data.transactions.map((transaction) => (
						<Card key={transaction._id} transaction={transaction} authUser={authUser.authUser} />
					))}
			</div>
			{!loading && data?.transactions?.length === 0 && (
				<p className='text-2xl font-bold text-center w-full'>No transaction history found.</p>
			)}
		</div>
	);
};

export default Cards;