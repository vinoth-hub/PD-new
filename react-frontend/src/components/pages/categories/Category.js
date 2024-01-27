import React, { useEffect, useState } from "react";
import { ParentPageWrapper } from "../../shared/ParentPageWrapper";
import styled from "@emotion/styled";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
} from "@mui/material";
import {
  ListBox,
  SplitContainer,
  StyledHeader,
  StyledTypography,
} from "../../../styles/commonStyles";
import { CommonSearch } from "../../shared/CommonSearch";
import { IconColor } from "../../../styles/constants";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deletewithQueryApiServices,
  getWithQueryApiServices,
} from "../../../apis/api";
import { apiRoutes } from "../../../apis/apiPath";
import { companyFormInitVal } from "../../../constants";
import { CategoryUser } from "./CategoryUser";
import { CategoryForm } from "./CategoryForm";
import { successToast } from "../../../utils/helper";
import Cookies from "universal-cookie";

// const demoValues = [
//   1, 2, 3, 4, 5, 6, 4, 3, 2, 34, 3, 3, 3, 5, 3, 2, 5, 3, 2, 5, 3,
// ];

const BoxContainer = styled(Box)(({ theme }) => ({
  padding: "1%",
  boxSizing: "border-box",
}));

const ParentContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const ActionContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxSizing: "border-box",
  marginLeft: "24px",
}));

const ActionItemContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  width: "36%",
  marginRight: 18,
}));

export const Category = () => {

  const cookies = new Cookies();
  const defaultcompany = cookies.get("defaultcompany");
  const [companyForm, setCompanyForm] = useState(companyFormInitVal);
  const [searchCategory, setSearchCategory] = useState("");
  const [categoryData, setCategoryData] = useState({});
  const [addNewCategory, setAddNewCategory] = useState(false)

  const handleCompanyCheckbox = (val) => {
    setCategoryData({ ...val });
    setAddNewCategory(val?.categoryID ? true : false);
  };

  const { data: companyData, refetch: companyListRefetch } = useQuery({
    queryKey: ["companyLists"],
    queryFn: () =>
      getWithQueryApiServices(apiRoutes.GET_COMPANY_LIST, `pageNumber=1`),
  });

  const { data: categotyData, refetch: categoryListRefetch } = useQuery({
    queryKey: ["categoryLists", companyForm, searchCategory],
    queryFn: () =>
      getWithQueryApiServices(
        apiRoutes.GET_CATEGOTY_LIST,
        `pageNumber=1&selectedCompany=${companyForm?.companyID}&search=${searchCategory}`
      ),
    enabled: !!companyForm?.companyID,
  });

  const deleteCategory = useMutation({
    mutationKey: ["deleteCategoryDetails"],
    mutationFn: (categoryID) =>
      deletewithQueryApiServices(
        apiRoutes.DELETE_CATEGORY,
        `selectedCompany=${companyForm?.companyID}`,
        categoryID
      ),
    onSuccess: () => {
      // companyListRefetch();
      categoryListRefetch();
      setAddNewCategory(false)
      setCategoryData({})
      successToast("Category Deleted!");
    },
  });

  useEffect(() => {
    const getDefaultCompany = companyData?.data?.list?.find((item) => item?.companyID === defaultcompany)
    setCompanyForm(getDefaultCompany)
  }, [companyData, defaultcompany])

  return (
    <ParentPageWrapper>
      <BoxContainer>
        <StyledHeader>Categories</StyledHeader>
        <ParentContainer>
          <SplitContainer style={{ backgroundColor: "transparent" }}>
            <div style={{ height: "80vh" }}>
              <div
                style={{
                  backgroundColor: "white",
                  height: "92%",
                  borderRadius: 10,
                }}
              >
                <ActionContainer>
                  <CommonSearch
                    value={searchCategory}
                    handleChange={(e) => setSearchCategory(e.target.value)}
                  />
                  <StyledTypography style={{ marginRight: "12%" }}>
                    Actions
                  </StyledTypography>
                </ActionContainer>
                <div
                  style={{
                    overflowY: "scroll",
                    height: "74%",
                  }}
                >
                  {categotyData?.data?.list?.length > 0 &&
                    companyForm?.companyID ? (
                    <FormGroup>
                      {categotyData?.data?.list?.map((item, i) => (
                        <ListBox>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  item?.categoryID === categoryData?.categoryID
                                }
                                onChange={() =>
                                  item?.categoryID === categoryData?.categoryID
                                    ? handleCompanyCheckbox({})
                                    : handleCompanyCheckbox(item)
                                }
                              />
                            }
                            label={item?.name}
                            style={{ marginLeft: "12px" }}
                          />
                          <ActionItemContainer>
                            <Switch />
                            <IconButton
                              onClick={() =>
                                item?.categoryID &&
                                deleteCategory.mutate(item?.categoryID)
                              }
                            >
                              <DeleteOutlineIcon
                                style={{ color: IconColor, fontSize: 26 }}
                              />
                            </IconButton>
                          </ActionItemContainer>
                        </ListBox>
                      ))}
                    </FormGroup>
                  ) : !companyForm?.companyID ? (
                    <StyledTypography style={{ textAlign: "center" }}>
                      Select any company
                    </StyledTypography>
                  ) : (
                    <StyledTypography style={{ textAlign: "center" }}>
                      No Data Found
                    </StyledTypography>
                  )}
                </div>
              </div>
              <Button
                variant="contained"
                style={{ position: "absolute", bottom: 0, marginLeft: "24px" }}
              >
                Copy Categories
              </Button>
            </div>
          </SplitContainer>
          <SplitContainer
            style={{ width: "30%", backgroundColor: "transparent", cursor: addNewCategory ? "auto" : "not-allowed", }}
          >
            <CategoryForm
              categoryListRefetch={categoryListRefetch}
              companyListRefetch={companyListRefetch}
              companyForm={companyForm}
              categoryData={categoryData}
              setCategoryData={setCategoryData}
              setAddNewCategory={setAddNewCategory}
              addNewCategory={addNewCategory}
            />
          </SplitContainer>
          <SplitContainer
            style={{ backgroundColor: "transparent", width: "30%" }}
          >
            <CategoryUser
              companyForm={companyForm}
              setCompanyForm={setCompanyForm}
              companyData={companyData}
              setAddNewCategory={setAddNewCategory}
              addNewCategory={addNewCategory}
              setCategoryData={setCategoryData}
              categoryData={categoryData}
            />
          </SplitContainer>
        </ParentContainer>
      </BoxContainer>
    </ParentPageWrapper>
  );
};
