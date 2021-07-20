import React, { useState, useEffect } from "react";

import Loader from 'react-loader-spinner';

import axios from "axios";

import '../../css/upcomingContests/upcomingContests.css'

const Upcoming = () => {
  const [contests, setContests] = useState(null);

  useEffect(async () => {
    const res = await axios.get(
      "https://codeforces.com/api/contest.list?gym=false"
    );

    console.log(res.data.result);

    setContests(res.data.result.reverse().filter((contest)=>contest.relativeTimeSeconds < 0));
  }, []);

  return (
    <div className="upComingContest wrapper">
      <div className="news">
        {contests ? (
          contests.length === 0 ? (
            <div>No Post TO show</div>
          ) : (
            contests.map((contest, index) => (
                    <a
                      href="https://codeforces.com/contests"
                      target='_blank'
                      className="news__card"
                      key={contest._id}
                    >
                      <img
                        src="https://i1.wp.com/sltechnicalacademy.com/wp-content/uploads/2021/01/codefoces.jpg?resize=800%2C497&ssl=1"
                        alt=""
                      />
                     <div style={{marginTop:'30px'}}>
                      <h2>{contest.name}</h2>
                        <p>
                          <strong>
                            Start Time:{" "}
                            {new Date(
                              contest.startTimeSeconds * 1000
                            ).toLocaleString()}
                            ,
                            {new Date(
                              contest.startTimeSeconds * 1000
                            ).toLocaleString("en-US", { weekday: "long" })}{" "}
                          </strong>
                        </p>
                        <p>
                          <strong>
                            Contest Duration:{" "}
                            {contest.durationSeconds / (60 * 60)} hrs
                          </strong>
                        </p>
                     </div>
                    </a>
            ))
          )
        ) : (
          <div style={{width:'100vw',display:'flex',alignItems:'center',justifyContent:'center',marginTop:'20vh'}}>
                      <Loader />
           </div>
        )}
      </div>
    </div>
  );
};

export default Upcoming;

// //         contest.relativeTimeSeconds<0
