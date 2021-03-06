import React, { useEffect, useState } from "react";
import styled from "styled-components";
import pdfImage from "../../../../images/pdf.svg";
import MessageIcon from "@material-ui/icons/Message";
import { Button } from "@material-ui/core";
import { DetailsContainer } from "./style";
import { fileDownload, acceptBid } from "../../../data/data";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";

const ReactionDetails = (props) => {
  const [snackbarSatus, setSnackbarStatus] = useState({
    open: false,
    color: "",
    message: "",
  });
  const [disableButton, setDisableButton] = useState(true);
  useEffect(() => {
    if (props.bid_data) {
      if (props.bid_data.offer.attend_id) setDisableButton(true);
      else setDisableButton(false);
    }
  }, [props.bid_data]);

  let bidData = props.bid_data ? props.bid_data : null;
  console.log(bidData);

  const download = (file, index) => {
    console.log(file);
    if (file) {
      let download_files = JSON.parse(file);
      download_files.map((element) => {
        let data = {
          file: element,
        };
        fileDownload(data).then((res) => {
          if (res.isError || res.shouldLogin) {
            console.error("errors");
          }
          if (res.error) {
            console.error("error");
          }
          console.log("I am download", res);
          const url = window.URL.createObjectURL(
            new Blob([res.data], {
              type: "image/pdf",
            })
          );
          console.log("link", url);

          const link = document.createElement("a");

          link.href = url;

          if (index === 1) link.setAttribute("download", element.split("/")[3]);
          else link.setAttribute("download", element.split("/")[4]);

          link.click();
        });
      });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      setSnackbarStatus({
        open: false,
        color: "",
        message: "",
      });
    }
  };

  const accept_bid = () => {
    let data = {
      company_id: bidData.user_id,
      offer_id: bidData.offer.id,
    };
    console.log(data);
    acceptBid(data).then((res) => {
      if (res.isError || res.shouldLogin) {
        console.error("errors");
      }
      if (res.error) {
        console.error("error");
      }
      console.log("I am accept bid", res.data);
      if (res.data.success) {
        setSnackbarStatus({
          open: true,
          color: "green",
          message: "Success",
        });
        setDisableButton(true);
      }
    });
  };
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarSatus.open}
        onClose={handleClose}
      >
        <SnackbarContent
          aria-describedby="message-id2"
          style={{ backgroundColor: snackbarSatus.color }}
          message={
            <span id="message-id2">
              <div>{snackbarSatus.message}</div>
            </span>
          }
        />
      </Snackbar>
      <DetailsContainer>
        <h1>Bieding</h1>
        <div className="blueDiv">
          <span>
            {bidData ? bidData.createdAt.split("T")[0] : ""} &nbsp;om{" "}
            {bidData ? bidData.createdAt.split("T")[1].split(".")[0] : ""}{" "}
            &nbsp;uur
          </span>
          <h1>€ {bidData ? bidData.bid : ""},-</h1>
        </div>
        <div className="lightBlueDiv">
          {bidData && bidData.files ? (
            <div className="firstDiv">
              <img
                src={pdfImage}
                onClick={() => download(bidData.offer.files, 1)}
              />
              new file
            </div>
          ) : (
            ""
          )}
          <div className="lastDiv">
            <span onClick={() => download(bidData.files, 2)}>
              Ga naar reacties
            </span>
            {/* <div className="oval">1</div> */}
          </div>
        </div>
        <div className="middleContainer">
          <span>Heeft u een vraag of wilt u meer informatie?</span>
          <Button
            variant="outlined"
            color="primary"
            className="button"
            endIcon={<MessageIcon />}
          >
            STUUR EEN BERICHT
          </Button>
        </div>

        <div className="lastContainer">
          <div className="contentLast">
            <span>Wilt u het bod vrijblijvend accepteren?</span>
            <Button
              variant="contained"
              color="primary"
              className="button"
              size="middle"
              onClick={accept_bid}
              disabled={disableButton}
            >
              BOOD ACCEPTEREM
            </Button>
          </div>
        </div>
      </DetailsContainer>
    </div>
  );
};

export default ReactionDetails;
