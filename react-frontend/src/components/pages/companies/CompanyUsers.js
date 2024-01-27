import React, { useState } from "react";
import { ListBox, StyledTypography } from "../../../styles/commonStyles";
import { CommonSearch } from "../../shared/CommonSearch";
import { IconButton, Typography } from "@mui/material";
import { IconColor } from "../../../styles/constants";
import PersonIcon from "@mui/icons-material/Person";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getWithQueryApiServices, putWithQueryApiServices } from "../../../apis/api";
import { apiRoutes } from "../../../apis/apiPath";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { successToast } from "../../../utils/helper";

export const CompanyUsers = ({ companyForm, addNewCompany }) => {
  const [searchUser, setSearchUser] = useState("");

  const { data: usersData, refetch: refetchUserList } = useQuery({
    queryKey: ["usersList", companyForm, searchUser],
    queryFn: () =>
      getWithQueryApiServices(
        apiRoutes.GET_USERS_LIST,
        `pageNumber=1&selectedCompany=${companyForm?.companyID}&search=${searchUser}`
      ),
    enabled: !!companyForm?.companyID,
  });

  const { data: allUsersList } = useQuery({
    queryKey: ["usersList", searchUser],
    queryFn: () =>
      getWithQueryApiServices(
        apiRoutes.GET_ALL_USERS_LIST,
        `pageNumber=1&search=${searchUser}`
      ),
  });



  const updateUserForCompany = useMutation({
    mutationKey: ["updateUsertoCompany"],
    mutationFn: (workData) => putWithQueryApiServices(apiRoutes.UPDATE_USER,
      `selectedCompany=${companyForm?.companyID}`
      , workData),
    onSuccess: () => {
      // companyListRefetch();
      // setCompanyForm(companyFormInitVal);
      refetchUserList();
      successToast("User Added Successfully");
    },
  });

  const checkUserExist = (data) => {
    const getCompany = usersData?.data?.userList?.find((item) => item?.userID === data?.userID)
    return getCompany?.userID ? true : false

  }

  const addUsertoCompany = (data) => {
    updateUserForCompany.mutate(data)
  }


  return (
    <div
      style={{
        height: "80vh",
        padding: "4px 20px",
        boxSizing: "border-box",
        borderRadius: 14,
        pointerEvents: !addNewCompany ? "none" : "auto",
        backgroundColor: !addNewCompany ? "#f0f0f0" : "white",
        opacity: !addNewCompany ? "0.6" : "1",
      }}
    >
      <StyledTypography>
        Add Users to Company {companyForm?.name}
      </StyledTypography>
      <CommonSearch
        style={{ width: "100%" }}
        label={"All Users"}
        value={searchUser}
        handleChange={(e) => setSearchUser(e.target.value)}
      />
      <div
        style={{
          height: "57vh",
          overflowY: "scroll",
          marginTop: 20,
        }}
      >
        {companyForm?.companyID || addNewCompany ? (
          <>
            {allUsersList?.data?.userList?.map((user, i) => (
              <ListBox
                style={{
                  padding: 10,
                  justifyContent: "normal",
                  backgroundColor: checkUserExist(user) ? "#deedf5" : "white",
                  borderRadius: 6
                }}
              >
                {
                  checkUserExist(user) ?
                    <PersonIcon
                      style={{
                        color: IconColor,
                        fontSize: 26,
                        marginRight: 20,
                      }}
                    />
                    :
                    <IconButton style={{ padding: 0, margin: 1 }} onClick={() => addUsertoCompany(user)}>
                      <GroupAddIcon
                        style={{
                          color: IconColor,
                          fontSize: 26,
                          marginRight: 20,
                        }}

                      />
                    </IconButton>
                }

                <Typography>{user?.username} </Typography>
              </ListBox>
            ))}
          </>
        ) : (
          <StyledTypography style={{ textAlign: "center" }}>
            Select any company
          </StyledTypography>
        )}
      </div>
    </div>
  );
};
