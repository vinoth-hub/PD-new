import React, { useState } from "react";
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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { CommonSearch } from "../../shared/CommonSearch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteApiServices, getWithQueryApiServices } from "../../../apis/api";
import { apiRoutes } from "../../../apis/apiPath";
import { companyFormInitVal } from "../../../constants";
import { successToast } from "../../../utils/helper";
import {
  ListBox,
  SplitContainer,
  StyledHeader,
  StyledTypography,
} from "../../../styles/commonStyles";
import { IconColor } from "../../../styles/constants";
import { CompanyUsers } from "./CompanyUsers";
import { CompanyForm } from "./CompanyForm";

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
  justifyContent: "space-between",
  alignItems: "center",
  width: "36%",
  marginRight: 18,
}));

export const Index = () => {
  const [searchCompany, setSearchCompany] = useState("");
  const [companyForm, setCompanyForm] = useState(companyFormInitVal);
  const [addNewCompany, setAddNewCompany] = useState(false);

  const handleCompanyCheckbox = (val) => {
    setCompanyForm({ ...val });
    setAddNewCompany(val?.companyID ? true : false);
  };

  const deleteCompany = useMutation({
    mutationKey: ["deleteCompanyDetails"],
    mutationFn: (companyID) =>
      deleteApiServices(apiRoutes.DELETE_COMPANY, companyID),
    onSuccess: () => {
      companyListRefetch();
      setCompanyForm(companyFormInitVal);
      successToast("Company Deleted!");
    },
  });

  const { data, refetch: companyListRefetch } = useQuery({
    queryKey: ["companyLists", searchCompany],
    queryFn: () =>
      getWithQueryApiServices(
        apiRoutes.GET_COMPANY_LIST,
        `pageNumber=1&search=${searchCompany}`
      ),
  });

  return (
    <ParentPageWrapper>
      <BoxContainer>
        <StyledHeader>Companies</StyledHeader>
        <ParentContainer>
          <SplitContainer>
            <div style={{ height: "80vh" }}>
              <ActionContainer>
                <CommonSearch
                  value={searchCompany}
                  handleChange={(e) => setSearchCompany(e.target.value)}
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
                <FormGroup>
                  {data?.data?.list?.map((item, i) => (
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
                        style={{ marginLeft: "12px" }}
                      />
                      <ActionItemContainer>
                        <Switch />
                        <IconButton
                          onClick={() =>
                            item?.companyID &&
                            deleteCompany.mutate(item?.companyID)
                          }
                        >
                          <DeleteOutlineIcon
                            style={{ color: IconColor, fontSize: 26 }}
                          />
                        </IconButton>
                        <AddToPhotosOutlinedIcon
                          style={{ color: IconColor, fontSize: 26 }}
                        />
                      </ActionItemContainer>
                    </ListBox>
                  ))}
                </FormGroup>
              </div>

              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                onClick={() => {
                  setCompanyForm(companyFormInitVal);
                  setAddNewCompany(true);
                }}
                style={{ position: "absolute", bottom: 35, marginLeft: "24px" }}
              >
                Add Company
              </Button>
            </div>
          </SplitContainer>
          <SplitContainer
            style={{
              width: "25%",
              cursor: addNewCompany ? "auto" : "not-allowed",
            }}
          >
            <CompanyForm
              addNewCompany={addNewCompany}
              setAddNewCompany={setAddNewCompany}
              companyForm={companyForm}
              setCompanyForm={setCompanyForm}
              companyListRefetch={companyListRefetch}
            />
          </SplitContainer>
          <SplitContainer
            style={{ cursor: addNewCompany ? "auto" : "not-allowed" }}
          >
            <CompanyUsers
              companyForm={companyForm}
              addNewCompany={addNewCompany}
            />
          </SplitContainer>
        </ParentContainer>
      </BoxContainer>
    </ParentPageWrapper>
  );
};
