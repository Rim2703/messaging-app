import { useEffect, useState } from "react";
import { fetchPreviousQuestion } from "../../Api";

const Question = () => {
    const [previousQuestion, setPreviousQuestion] = useState();
    const fetchPreviousQuestions = async () => {
        const data = { clientId: localStorage.getItem('_id') };
        const response = await fetchPreviousQuestion(data);
        setPreviousQuestion(response?.data?.data?.data);
    };
    useEffect(() => {
        fetchPreviousQuestions();
    }, []);
    return (
        <>
            {
                previousQuestion?.length !== 0 && <h1 style={{ fontSize: '2vh' }} className="text-center text-white ">Previous Question</h1>
            }
            {
                previousQuestion?.map((data, index) => {
                    return (
                        <div key={index} style={{ marginTop: '1em', marginBottom: '1em' }} className="bg-slate-500 justify-end p-2 shadow rounded">
                            <p className="text-white text-right">Question : {data.query} ?</p>
                            {
                                data?.ans?.map((data, index) => {
                                    return (<p key={index} className="text-white text-left">Ans : {data}</p>)
                                })
                            }
                        </div>
                    );
                })
            }
            {
                previousQuestion?.length !== 0 && <h1 style={{ fontSize: '2vh' }} className="text-center text-white ">New Questions</h1>
            }
        </>
    );
};
export default Question;