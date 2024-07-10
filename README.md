# TruthBot

TruthBot is an example web app that leverages the power of AI and blockchain technology to verify statements and create
immutable attestations. Built with Next.js, React, and the Ethereum Attestation Service (EAS), this project aims to
combat misinformation by providing a transparent and decentralized platform for fact-checking.

## Features

- **AI-Powered Verification**: Utilizes advanced language models to analyze and verify user-submitted statements.
- **Blockchain Attestations**: Creates immutable records of verifications using the Ethereum Attestation Service.
- **Interactive UI**: Offers a user-friendly interface for submitting statements and viewing results.
- **Voting System**: Allows users to upvote or downvote attestations, adding a layer of community-driven validation.
- **Recent Attestations**: Displays a list of recent verifications for public viewing.

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Blockchain Integration**: Ethereum, EAS (Ethereum Attestation Service)
- **AI Integration**: OpenAI's language models (or similar)
- **Styling**: Tailwind CSS with styled-components (twin.macro)
- **Animation**: Lottie for smooth, scalable animations

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn or npm
- MetaMask or another Ethereum wallet

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/truth-verifier.git
   cd truth-verifier
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
   OPENAI_API_KEY=your_openai_api_key
   ETH_KEY=attester_key
   ```

4. Run the development server:
   ```
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Connect your Ethereum wallet (e.g., MetaMask) to the Sepolia testnet.
2. Navigate to the main page and enter a statement you want to verify.
3. Click "Tell me the Truth" to submit the statement for verification.
4. View the AI's analysis and the created attestation.
5. Optionally, upvote or downvote the attestation.
6. Explore recent attestations on the "Recent Attestations" page.

## Disclaimer

This project is for educational and demonstration purposes only. The verifications provided by the AI should not be
considered as absolute truth and users are encouraged to cross-reference information from multiple reliable sources.
