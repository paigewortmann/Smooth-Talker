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
    const [rate, setRate] = useState(1.5); // Default to a reasonable mid-value for wpm
    const [isPlaying, setIsPlaying] = useState(false);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const handleRateChange = (event: Event, newValue: number | number[]) => {
        setRate(newValue as number);
    };

    const handlePlay = () => {
        const wpmRate = Math.round(rate * 100); // Convert to wpm range (100-200)
        
        api.post('/speak', { text, rate: wpmRate })
            .then(() => {
                setIsPlaying(true);
                // Estimate the duration based on text length and rate
                const estimatedDuration = (text.length / (wpmRate / 10)) * 1000; // Adjust the formula as needed
                setTimeout(() => {
                    setIsPlaying(false);
                }, estimatedDuration);
            })
            .catch(error => {
                console.error('Error speaking:', error);
                setIsPlaying(false); // Ensure state resets on error
            });
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
                color="primary"
                onClick={handlePlay}
                disabled={isPlaying}
            >
                Play
            </Button>
        </Container>
    );
};

export default TtsComponent;
