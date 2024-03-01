import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function CardData(props) {
    return (
           < Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {props.title}
                </Typography>
                <Link href={props.link}>{props.link}</Link>
                <Typography variant="body2">
                    {props.snippet}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default CardData;