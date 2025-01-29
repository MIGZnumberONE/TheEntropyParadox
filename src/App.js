import React, { useState } from 'react';
import './App.css';
import Footer from './footer'; // Korrekter Pfad: ./footer (kleines f)

function PasswordGenerator() {
    const [length, setLength] = useState(12);
    const [charset, setCharset] = useState('alphanumeric');
    const [customChars, setCustomChars] = useState('');
    const [useEntropy, setUseEntropy] = useState(false);
    const [entropy, setEntropy] = useState(128);
    const [password, setPassword] = useState('');
    const [generatedPasswords, setGeneratedPasswords] = useState([]);
    const [calculatedEntropy, setCalculatedEntropy] = useState(0);

    const generatePassword = () => {
        let effectiveLength = length;
        if (useEntropy) {
            effectiveLength = Math.ceil(entropy / Math.log2(charset === 'custom' ? customChars.length : (charset === 'alphanumeric' ? 62 : (charset === 'numeric' ? 10 : 33))));
        } else {
            effectiveLength = length;
        }

        let characters = charset === 'alphanumeric' ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' :
            charset === 'numeric' ? '0123456789' :
                charset === 'symbols' ? '!@#$%^&*()_+=-`~[]{}|;\':",./<>?' :
                    customChars;

        let newPassword = '';
        for (let i = 0; i < effectiveLength; i++) {
            newPassword += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        setPassword(newPassword);
        setGeneratedPasswords([...generatedPasswords, newPassword]);

        // Berechne die Entropie *nachdem* das Passwort generiert wurde:
        const entropyValue = calculateEntropy(newPassword, characters);
        setCalculatedEntropy(entropyValue);
    };

    const calculateEntropy = (password, characters) => {
        let entropy = 0;
        if (password.length === 0) {
            return 0;
        }
        for (let i = 0; i < password.length; i++) {
            const char = password.charAt(i);
            const index = characters.indexOf(char);
            if (index === -1) {
                console.error("Zeichen '" + char + "' nicht im Zeichensatz enthalten.");
                return "Entropie kann nicht berechnet werden (ungültige Zeichen)";
            }
            const probability = (index + 1) / characters.length;
            entropy -= probability * Math.log2(probability);
        }
        return entropy;
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            generatePassword();
        }
    };

    return (
        <div className="container">
            <h1>Passwort Generator</h1>
            <div className="options" onKeyDown={handleKeyDown}>
                <label htmlFor="length">Länge:</label>
                <input type="number" id="length" value={length} min="1" max="100" onChange={e => setLength(e.target.value)} />

                <label htmlFor="charset">Zeichensatz:</label>
                <select id="charset" value={charset} onChange={e => setCharset(e.target.value)}>
                    <option value="alphanumeric">Alphanumerisch</option>
                    <option value="numeric">Numerisch</option>
                    <option value="symbols">Symbole</option>
                    <option value="custom">Benutzerdefiniert</option>
                </select>

                {charset === 'custom' && (
                    <div>
                        <label htmlFor="customChars">Benutzerdefinierte Zeichen:</label>
                        <input type="text" id="customChars" value={customChars} onChange={e => setCustomChars(e.target.value)} />
                    </div>
                )}

                <label htmlFor="useEntropy">
                    <input type="checkbox" id="useEntropy" checked={useEntropy} onChange={e => setUseEntropy(e.target.checked)} />
                    Entropie verwenden (Bits):
                </label>
                <input type="number" id="entropy" value={entropy} min="1" max="512" disabled={!useEntropy} onChange={e => setEntropy(e.target.value)} />

                <button onClick={generatePassword}>Generieren</button>
            </div>
            <div className="result">
                <label htmlFor="password">Passwort:</label>
                <input type="text" id="password" value={password} readOnly />
                <button onClick={() => navigator.clipboard.writeText(password)}>Kopieren</button>
                <p id="entropy-display">
                    Entropie: {typeof calculatedEntropy === 'number' ? calculatedEntropy.toFixed(2) : calculatedEntropy} bits
                </p>
            </div>

            <div className="generated-passwords">
                <h2>Generierte Passwörter:</h2>
                <ul>
                    {generatedPasswords.map((p, i) => (
                        <li key={i}>{i + 1}. {p}</li>
                    ))}
                </ul>
            </div>
            <Footer /> {/* Hier wird die Footer-Komponente eingefügt */}
        </div>
    );
}

export default PasswordGenerator;