document.addEventListener('DOMContentLoaded', function() {
            // Calculator state
            const calculator = {
                displayValue: '0',
                firstOperand: null,
                waitingForSecondOperand: false,
                operator: null,
                memory: 0,
                scientificMode: false,
                history: [],
                
                // Initialize calculator
                init() {
                    this.updateDisplay();
                    this.setupEventListeners();
                    this.loadHistory();
                },
                
                // Update display
                updateDisplay() {
                    document.getElementById('display').textContent = this.displayValue;
                },
                
                // Handle number input
                inputDigit(digit) {
                    if (this.waitingForSecondOperand) {
                        this.displayValue = digit;
                        this.waitingForSecondOperand = false;
                    } else {
                        this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
                    }
                    this.updateDisplay();
                },
                
                // Handle decimal point
                inputDecimal() {
                    if (this.waitingForSecondOperand) {
                        this.displayValue = '0.';
                        this.waitingForSecondOperand = false;
                        this.updateDisplay();
                        return;
                    }
                    
                    if (!this.displayValue.includes('.')) {
                        this.displayValue += '.';
                        this.updateDisplay();
                    }
                },
                
                // Handle operators
                handleOperator(operator) {
                    const inputValue = parseFloat(this.displayValue);
                    
                    if (this.firstOperand === null) {
                        this.firstOperand = inputValue;
                    } else if (this.operator) {
                        const result = this.calculate(this.firstOperand, inputValue, this.operator);
                        this.displayValue = String(result);
                        this.addToHistory(`${this.firstOperand} ${this.operator} ${inputValue} = ${result}`);
                        this.firstOperand = result;
                    }
                    
                    this.waitingForSecondOperand = true;
                    this.operator = operator;
                    this.updateDisplay();
                },
                
                // Perform calculation
                calculate(a, b, operator) {
                    switch (operator) {
                        case '+': return a + b;
                        case '-': return a - b;
                        case '×': return a * b;
                        case '÷': return a / b;
                        default: return b;
                    }
                },
                
                // Handle equals
                handleEquals() {
                    if (this.operator === null || this.waitingForSecondOperand) {
                        return;
                    }
                    
                    const inputValue = parseFloat(this.displayValue);
                    const result = this.calculate(this.firstOperand, inputValue, this.operator);
                    this.displayValue = String(result);
                    this.addToHistory(`${this.firstOperand} ${this.operator} ${inputValue} = ${result}`);
                    this.firstOperand = result;
                    this.operator = null;
                    this.waitingForSecondOperand = false;
                    this.updateDisplay();
                },
                
                // Reset calculator
                resetCalculator() {
                    this.displayValue = '0';
                    this.firstOperand = null;
                    this.waitingForSecondOperand = false;
                    this.operator = null;
                    this.updateDisplay();
                },
                
                // Backspace function
                backspace() {
                    if (this.displayValue.length > 1) {
                        this.displayValue = this.displayValue.slice(0, -1);
                    } else {
                        this.displayValue = '0';
                    }
                    this.updateDisplay();
                },
                
                // Negate function
                negate() {
                    this.displayValue = String(parseFloat(this.displayValue) * -1);
                    this.updateDisplay();
                },
                
                // Memory functions
                memoryClear() {
                    this.memory = 0;
                },
                
                memoryRecall() {
                    this.displayValue = String(this.memory);
                    this.updateDisplay();
                },
                
                memoryAdd() {
                    this.memory += parseFloat(this.displayValue);
                },
                
                memorySubtract() {
                    this.memory -= parseFloat(this.displayValue);
                },
                
                // Scientific functions
                square() {
                    const value = parseFloat(this.displayValue);
                    const result = value * value;
                    this.displayValue = String(result);
                    this.addToHistory(`sqr(${value}) = ${result}`);
                    this.updateDisplay();
                },
                
                sqrt() {
                    const value = parseFloat(this.displayValue);
                    if (value < 0) {
                        this.displayValue = 'Error';
                        this.updateDisplay();
                        setTimeout(() => {
                            this.displayValue = '0';
                            this.updateDisplay();
                        }, 1500);
                        return;
                    }
                    const result = Math.sqrt(value);
                    this.displayValue = String(result);
                    this.addToHistory(`√(${value}) = ${result}`);
                    this.updateDisplay();
                },
                
                power() {
                    this.handleOperator('^');
                },
                
                modulo() {
                    this.handleOperator('%');
                },
                
                sin() {
                    const value = parseFloat(this.displayValue);
                    const radians = value * (Math.PI / 180);
                    const result = Math.sin(radians);
                    this.displayValue = String(result);
                    this.addToHistory(`sin(${value}°) = ${result}`);
                    this.updateDisplay();
                },
                
                cos() {
                    const value = parseFloat(this.displayValue);
                    const radians = value * (Math.PI / 180);
                    const result = Math.cos(radians);
                    this.displayValue = String(result);
                    this.addToHistory(`cos(${value}°) = ${result}`);
                    this.updateDisplay();
                },
                
                tan() {
                    const value = parseFloat(this.displayValue);
                    const radians = value * (Math.PI / 180);
                    const result = Math.tan(radians);
                    this.displayValue = String(result);
                    this.addToHistory(`tan(${value}°) = ${result}`);
                    this.updateDisplay();
                },
                
                pi() {
                    this.displayValue = String(Math.PI);
                    this.updateDisplay();
                },
                
                log() {
                    const value = parseFloat(this.displayValue);
                    if (value <= 0) {
                        this.displayValue = 'Error';
                        this.updateDisplay();
                        setTimeout(() => {
                            this.displayValue = '0';
                            this.updateDisplay();
                        }, 1500);
                        return;
                    }
                    const result = Math.log10(value);
                    this.displayValue = String(result);
                    this.addToHistory(`log(${value}) = ${result}`);
                    this.updateDisplay();
                },
                
                ln() {
                    const value = parseFloat(this.displayValue);
                    if (value <= 0) {
                        this.displayValue = 'Error';
                        this.updateDisplay();
                        setTimeout(() => {
                            this.displayValue = '0';
                            this.updateDisplay();
                        }, 1500);
                        return;
                    }
                    const result = Math.log(value);
                    this.displayValue = String(result);
                    this.addToHistory(`ln(${value}) = ${result}`);
                    this.updateDisplay();
                },
                
                factorial() {
                    const value = parseInt(this.displayValue);
                    if (value < 0 || value > 170) {
                        this.displayValue = 'Error';
                        this.updateDisplay();
                        setTimeout(() => {
                            this.displayValue = '0';
                            this.updateDisplay();
                        }, 1500);
                        return;
                    }
                    
                    let result = 1;
                    for (let i = 2; i <= value; i++) {
                        result *= i;
                    }
                    
                    this.displayValue = String(result);
                    this.addToHistory(`${value}! = ${result}`);
                    this.updateDisplay();
                },
                
                e() {
                    this.displayValue = String(Math.E);
                    this.updateDisplay();
                },
                
                // History functions
                addToHistory(calculation) {
                    this.history.unshift(calculation);
                    if (this.history.length > 10) {
                        this.history.pop();
                    }
                    this.saveHistory();
                    this.updateHistoryDisplay();
                },
                
                saveHistory() {
                    localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
                },
                
                loadHistory() {
                    const savedHistory = localStorage.getItem('calculatorHistory');
                    if (savedHistory) {
                        this.history = JSON.parse(savedHistory);
                        this.updateHistoryDisplay();
                    }
                },
                
                clearHistory() {
                    this.history = [];
                    this.saveHistory();
                    this.updateHistoryDisplay();
                },
                
                updateHistoryDisplay() {
                    const historyList = document.getElementById('history-list');
                    historyList.innerHTML = '';
                    
                    this.history.forEach(item => {
                        const historyItem = document.createElement('div');
                        historyItem.className = 'history-item p-2 rounded-lg text-sm text-gray-700 dark:text-gray-300';
                        historyItem.textContent = item;
                        historyList.appendChild(historyItem);
                    });
                },
                
                // Toggle scientific mode
                toggleScientificMode() {
                    this.scientificMode = !this.scientificMode;
                    const scientificBtns = document.querySelectorAll('.scientific-btn');
                    scientificBtns.forEach(btn => {
                        btn.classList.toggle('hidden');
                    });
                },
                
                // Toggle theme
                toggleTheme() {
                    document.body.classList.toggle('dark');
                    const isDark = document.body.classList.contains('dark');
                    
                    if (isDark) {
                        document.body.classList.remove('bg-gradient-to-b', 'from-sky-300', 'to-sky-100');
                        document.body.classList.add('bg-gradient-to-b', 'from-gray-900', 'to-black');
                    } else {
                        document.body.classList.remove('bg-gradient-to-b', 'from-gray-900', 'to-black');
                        document.body.classList.add('bg-gradient-to-b', 'from-sky-300', 'to-sky-100');
                    }
                },
                
                // Setup event listeners
                setupEventListeners() {
                    // Get all calculator buttons
                    const buttons = document.querySelectorAll('.calculator-container button');
                    
                    // Add click event to each button
                    buttons.forEach(button => {
                        button.addEventListener('click', () => {
                            const action = button.dataset.action;
                            const value = button.dataset.value;
                            
                            switch (action) {
                                case 'number':
                                    this.inputDigit(value);
                                    break;
                                case 'decimal':
                                    this.inputDecimal();
                                    break;
                                case 'operator':
                                    this.handleOperator(value);
                                    break;
                                case 'equals':
                                    this.handleEquals();
                                    break;
                                case 'clear':
                                    this.resetCalculator();
                                    break;
                                case 'backspace':
                                    this.backspace();
                                    break;
                                case 'negate':
                                    this.negate();
                                    break;
                                case 'memory-clear':
                                    this.memoryClear();
                                    break;
                                case 'memory-recall':
                                    this.memoryRecall();
                                    break;
                                case 'memory-add':
                                    this.memoryAdd();
                                    break;
                                case 'memory-subtract':
                                    this.memorySubtract();
                                    break;
                                case 'square':
                                    this.square();
                                    break;
                                case 'sqrt':
                                    this.sqrt();
                                    break;
                                case 'power':
                                    this.power();
                                    break;
                                case 'modulo':
                                    this.modulo();
                                    break;
                                case 'sin':
                                    this.sin();
                                    break;
                                case 'cos':
                                    this.cos();
                                    break;
                                case 'tan':
                                    this.tan();
                                    break;
                                case 'pi':
                                    this.pi();
                                    break;
                                case 'log':
                                    this.log();
                                    break;
                                case 'ln':
                                    this.ln();
                                    break;
                                case 'factorial':
                                    this.factorial();
                                    break;
                                case 'e':
                                    this.e();
                                    break;
                            }
                        });
                    });
                    
                    // Keyboard support
                    document.addEventListener('keydown', (event) => {
                        const key = event.key;
                        
                        if (/[0-9]/.test(key)) {
                            this.inputDigit(key);
                        } else if (key === '.') {
                            this.inputDecimal();
                        } else if (key === '+' || key === '-') {
                            this.handleOperator(key);
                        } else if (key === '*') {
                            this.handleOperator('×');
                        } else if (key === '/') {
                            event.preventDefault();
                            this.handleOperator('÷');
                        } else if (key === '=' || key === 'Enter') {
                            this.handleEquals();
                        } else if (key === 'Escape') {
                            this.resetCalculator();
                        } else if (key === 'Backspace') {
                            this.backspace();
                        } else if (key === 's') {
                            this.toggleScientificMode();
                        } else if (key === 't') {
                            this.toggleTheme();
                        }
                    });
                    
                    // Theme toggle
                    document.getElementById('theme-toggle').addEventListener('click', () => {
                        this.toggleTheme();
                    });
                    
                    // Scientific mode toggle
                    document.getElementById('scientific-toggle').addEventListener('click', () => {
                        this.toggleScientificMode();
                    });
                    
                    // History toggle
                    document.getElementById('history-toggle').addEventListener('click', () => {
                        document.getElementById('history-panel').classList.toggle('hidden');
                    });
                    
                    // Close shortcuts
                    document.getElementById('close-shortcuts').addEventListener('click', () => {
                        document.querySelector('.bg-white.dark\\:bg-gray-800').classList.add('hidden');
                    });
                    
                    // Clear history
                    document.getElementById('clear-history').addEventListener('click', () => {
                        this.clearHistory();
                    });
                }
            };
            
            // Initialize calculator
            calculator.init();
        });