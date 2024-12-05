import { useEffect, useState } from "react";
import { fetchPendingQuestion } from "../../Api";
import PendQuestion from "./PendQuestion";

const Pending = () => {
    const [pendingQuestion, setPendingQuestion] = useState();
    const fetchPendingQuestions = async () => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const data = {
            roomType: params.get('roomType')
        }
        const response = await fetchPendingQuestion(data);
        setPendingQuestion(response?.data?.data)
    }
    useEffect(() => {
        fetchPendingQuestions();
    }, []);
    return (
        <>
            {
                pendingQuestion?.length !== 0 && <h1 className="text-center text-white">Pending Question</h1>
            }
            {
                pendingQuestion?.map((data, index) => {
                    return (
                        <PendQuestion key={index} data={data} />
                    );
                })
            }
            {
                pendingQuestion?.length !== 0 && <h1 className="text-center text-white">Live Question</h1>
            }
        </>
    );
};
export default Pending;