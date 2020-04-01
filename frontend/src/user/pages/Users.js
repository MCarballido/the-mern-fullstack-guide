import React from "react";

import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Manu",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/6/63/Liverpool_vs._Chelsea%2C_UEFA_Super_Cup_2019-08-14_04.jpg",
      places: 3
    }
  ];

  return <UsersList items={USERS} />;
};

export default Users;
