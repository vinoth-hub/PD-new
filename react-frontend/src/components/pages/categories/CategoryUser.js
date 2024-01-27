import React, { useState } from "react";
import { ListBox, StyledTypography } from "../../../styles/commonStyles";
import { CommonSearch } from "../../shared/CommonSearch";
import { Checkbox, FormControlLabel, IconButton, Typography } from "@mui/material";
import { IconColor } from "../../../styles/constants";
import PersonIcon from "@mui/icons-material/Person";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getWithQueryApiServices, putWithQueryApiServices } from "../../../apis/api";
import { apiRoutes } from "../../../apis/apiPath";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { successToast } from "../../../utils/helper";


export const CategoryUser = ({ companyForm, setCompanyForm, companyData, addNewCategory, setAddNewCategory, setCategoryData, categoryData }) => {
  const [searchUser, setSearchUser] = useState("");

  const handleCompanyCheckbox = (val) => {
    setCompanyForm({ ...val });
    setAddNewCategory(false)
    setCategoryData({})
  };

  const checkUserExistForCategory = (data) => {
    return data?.categoryList?.includes(categoryData?.name)
  }

  const addUserForCategory = (user) => {
    const workData = {
      ...user,
      categoryList: user?.categoryList && user?.categoryList?.length > 0 ? [...user?.categoryList, categoryData?.name] : [categoryData?.name]
    }
    updateUserForCategory.mutate(workData)
  }

  const { data: usersData, refetch: userDatas } = useQuery({
    queryKey: ["usersList", companyForm, searchUser],
    queryFn: () =>
      getWithQueryApiServices(
        apiRoutes.GET_USERS_LIST,
        `pageNumber=1&selectedCompany=${companyForm?.companyID}&search=${searchUser}`
      ),
    enabled: !!companyForm?.companyID,
  });

  const updateUserForCategory = useMutation({
    mutationKey: ["updateUserForCategory"],
    mutationFn: (workData) => putWithQueryApiServices(apiRoutes.UPDATE_USER,
      `selectedCompany=${companyForm?.companyID}`
      , workData),
    onSuccess: () => {
      // companyListRefetch();
      // setCompanyForm(companyFormInitVal);
      userDatas();
      successToast("User Added For Category");
    },
  });

  //   const { data, refetch: companyListRefetch } = useQuery({
  //     queryKey: ["companyLists"],
  //     queryFn: () =>
  //       getWithQueryApiServices(apiRoutes.GET_COMPANY_LIST, `pageNumber=1`),
  //   });

  return (
    <div
      style={{
        height: "80vh",
        // padding: "0 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          height: "92%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            height: "40%",
            padding: "0 20px",
            backgroundColor: "white",
            borderRadius: 14,
            boxSizing: "border-box",
          }}
        >
          <StyledTypography>Select Company</StyledTypography>
          <div
            style={{
              height: "60%",
              overflowY: "scroll",
              marginTop: 20,
            }}
          >
            {companyData?.data?.list?.map((item, i) => (
              <ListBox>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item?.companyID === companyForm?.companyID}
                      onChange={() =>
                        item?.companyID === companyForm?.companyID
                          ? handleCompanyCheckbox({})
                          : handleCompanyCheckbox(item)
                      }
                    />
                  }
                  label={item?.name}
                />
              </ListBox>
            ))}
          </div>
        </div>

        <div
          style={{
            height: "55%",
            padding: 20,
            boxSizing: "border-box",
            borderRadius: 14,
            pointerEvents: !addNewCategory ? "none" : "auto",
            backgroundColor: !addNewCategory ? "#f0f0f0" : "white",
          }}
        >
          <StyledTypography>
            Add Users to Category {companyForm?.name}
          </StyledTypography>
          <CommonSearch
            style={{ width: "100%" }}
            label={"All Users"}
            value={searchUser}
            handleChange={(e) => setSearchUser(e.target.value)}
          />
          <div
            style={{
              height: "55%",
              overflowY: "scroll",
              marginTop: 20,
            }}
          >
            {categoryData?.categoryID ? (
              <>
                {usersData?.data?.userList?.map((user, i) => (
                  <ListBox
                    style={{
                      padding: 10,
                      justifyContent: "normal",
                      backgroundColor: checkUserExistForCategory(user) ? "#deedf5" : "white",
                      borderRadius: 6
                    }}
                  >

                    {
                      checkUserExistForCategory(user) ? <PersonIcon
                        style={{
                          color: IconColor,
                          fontSize: 26,
                          marginRight: 20,
                        }}
                      />
                        :
                        <IconButton style={{ padding: 0, margin: 1 }} onClick={() => addUserForCategory(user)}>
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
                Select any category
              </StyledTypography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
