import React, { useState } from 'react';
import axios from 'axios';
import { Button, Slider, Typography, Container, TextareaAutosize } from '@mui/material';
import { styled } from '@mui/system';

// Define the base URL for Axios
const api = axios.create({
    baseURL: 'http://127.0.0.1:5000',
});

const StyledTextareaAutosize = styled(TextareaAutosize)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    resize: 'none',
    '&:focus': {
        borderColor: theme.palette.primary.dark,
    },
    minHeight: '100px',
}));

const TtsComponent: React.FC = () => {
    const [text, setText] = useState('');
    const [rate, setRate] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const handleRateChange = (event: Event, newValue: number | number[]) => {
        setRate(newValue as number);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            api.post('/stop')
                .then(() => setIsPlaying(false))
                .catch(error => console.error('Error stopping:', error));
        } else {
            api.post('/speak', { text, rate })
                .then(() => setIsPlaying(true))
                .catch(error => console.error('Error speaking:', error));
        }
    };

    const handlePause = () => {
        api.post('/pause')
            .then(() => setIsPlaying(false))
            .catch(error => console.error('Error pausing:', error));
    };

    const handleResume = () => {
        api.post('/resume')
            .then(() => setIsPlaying(true))
            .catch(error => console.error('Error resuming:', error));
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Smooth Sayer
            </Typography>
            <StyledTextareaAutosize
                minRows={3}
                maxRows={6}
                value={text}
                onChange={handleTextChange}
                placeholder="Enter text"
            />
            <Typography gutterBottom>Playback Speed</Typography>
            <Slider
                value={rate}
                min={0.5}
                max={2}
                step={0.1}
                onChange={handleRateChange}
                valueLabelDisplay="auto"
                aria-labelledby="rate-slider"
            />
            <Button
                variant="contained"
                color={isPlaying ? 'secondary' : 'primary'}
                onClick={handlePlayPause}
            >
                {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handlePause}
            >
                Pause
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleResume}
            >
                Resume
            </Button>
        </Container>
    );
};

export default TtsComponent;
