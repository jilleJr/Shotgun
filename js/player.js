
/*
	Actions
	'shoot'
	'shotgun'
	'reload'
	'dodge'
	'none' -- only before first action
 */

class Player {

	constructor(id) {
		this.id = id;
		this.imgQuery = '#' + id + 'Image';
		this.imgPrefix = id + "_";
		
		this.dead = true;
		this.ammo = 0;
		this.action = 'none';
		this.wins = 0;
	}

	won() {
		if (this.wins < 999) this.wins++;

		let numZeros = Math.floor(2 - Math.log10(this.wins));
		let zeros = '0'.repeat(numZeros);

		$(`#${this.id}WinsZeros`).text(zeros);
		$(`#${this.id}Wins`).text(this.wins);
	}

	updateShellsGraphics() {
		const yes = 'gifs/shell_yes.png';
		const no = 'gifs/shell_no.png';

		for (let i = 1; i <= 3; i++) {
			let src = this.ammo >= i ? yes : no;
			$(`#${this.id}Bullet${i}`).attr('src', src);
		}
	}

	spawn() {
		this.playAnimation('walk');
		this.dead = false;
		this.ammo = 0;
		this.action = 'none';
		this.streak = 0;
		
		this.updateShellsGraphics();
		setTimeout(this.drawGun.bind(this), 4000);
	}

	drawGun() {
		this.playAnimation('draw');
	}

	evaluateAction(enemy) {
		if (enemy.action === 'shotgun')
			this.dead = true;

		switch (this.action) {
			case 'shoot':
				if (this.ammo > 0)
					this.ammo--;
				break;

			case 'shotgun':
				if (this.ammo === 3)
					this.ammo = 0;
				break;

			case 'reload':
				if (enemy.action === 'shoot' || enemy.action === 'shotgun')
					this.dead = true;
				else if (this.ammo < 3)
					this.ammo++;
				break;

			case 'dodge':
				break;
			
			default:
				throw `Unknown action "${this.action}" for player "${this.id}"`;
				return;
		}

		this.updateShellsGraphics();
		this.playAnimation(this.getAnimation(enemy));
	}
	
	playAnimation(anim) {
		if (!anim) return;
		const path = 'gifs/' + this.imgPrefix + anim + '.gif';
		$(this.imgQuery).attr('src', path);
	}

	getAnimation(enemy) {
		if (this.action === 'dodge') {
			if (enemy.action === 'shoot') return 'dodge_bullet';
			if (enemy.action === 'shotgun') return 'dodge_shotgun';
			return 'dodge_nothing';
		}
		if (this.action === 'reload') {
			if (enemy.action === 'shoot') return 'die';
			if (enemy.action === 'shotgun') return 'die_shotgun';
			return 'reload';
		}
		if (this.action === 'shoot' || this.action === 'shotgun') {
			if (enemy.action === 'shoot') return 'shoot_dodge';
			if (enemy.action === 'shotgun') return 'shoot_die';
			return 'shoot';
		}

		return null;
	}
}
